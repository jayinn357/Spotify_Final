import sequelize from '../config/database.js';
import { Op } from 'sequelize';
import Track from '../models/Track.js';
import Album from '../models/Album.js';
import Artist from '../models/Artist.js';
import { makeSpotifyRequest } from './spotifyController.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper: persist an array of formatted tracks into DB. Each track should follow the formatted shape used by controllers
const persistTracks = async (formattedTracks, markPopular = false) => {
  if (!Array.isArray(formattedTracks) || formattedTracks.length === 0) return;

  await sequelize.transaction(async (t) => {
    for (const tr of formattedTracks) {
      try {
        // Determine primary artist (first in array)
        const primaryArtist = (tr.artists && tr.artists[0]) || null;
        const artistName = primaryArtist ? primaryArtist.name : 'Unknown Artist';
        const artistSpotifyId = primaryArtist ? primaryArtist.id : null;

        // Find artist (DON'T create new artists - only use existing SB19 + 5 members)
        let artistInstance = null;
        if (artistSpotifyId) {
          artistInstance = await Artist.findOne({
            where: { spotify_id: artistSpotifyId },
            transaction: t
          });
          // If artist doesn't exist in our DB (not SB19 or a member), skip this track
          if (!artistInstance) {
            console.log(`Skipping track "${tr.name}" - artist ${artistName} (${artistSpotifyId}) not in our database`);
            continue;
          }
        } else {
          // No spotify ID, try to find by name
          artistInstance = await Artist.findOne({
            where: { name: artistName },
            transaction: t
          });
          // If not found, skip
          if (!artistInstance) {
            console.log(`Skipping track "${tr.name}" - artist ${artistName} not in our database`);
            continue;
          }
        }

        // Album upsert
        let albumIdDb = null;
        if (tr.album && tr.album.id) {
          const albumSpotifyId = tr.album.id;
          const albumName = tr.album.name || 'Unknown Album';
          const albumImages = tr.album.images || null;

          const [albumInstance] = await Album.findOrCreate({
            where: { spotify_id: albumSpotifyId },
            defaults: { spotify_id: albumSpotifyId, name: albumName, images: albumImages },
            transaction: t
          });

          if ((albumInstance.name !== albumName) || (JSON.stringify(albumInstance.images) !== JSON.stringify(albumImages))) {
            albumInstance.name = albumName;
            albumInstance.images = albumImages;
            await albumInstance.save({ transaction: t });
          }

          albumIdDb = albumInstance.id;
        }

        const spotifyTrackId = tr.id || tr.spotify_track_id || tr.spotify_id || null;
        if (!spotifyTrackId) continue;

        // Check existing
        const existing = await Track.findOne({ where: { spotify_track_id: spotifyTrackId }, transaction: t });
        if (existing) {
          // Optionally update metadata if changed
          let needsSave = false;
          if (!existing.title && tr.name) { existing.title = tr.name; needsSave = true; }
          if (!existing.duration_ms && tr.duration_ms) { existing.duration_ms = tr.duration_ms; needsSave = true; }
          if (markPopular && !existing.is_popular) { existing.is_popular = true; needsSave = true; }
          if (needsSave) await existing.save({ transaction: t });
          continue;
        }

        // Create track
        await Track.create({
          spotify_track_id: spotifyTrackId,
          spotify_id: tr.spotify_id || null,
          title: tr.name || tr.title || '',
          artist_id: artistInstance ? artistInstance.id : null,
          album_id: albumIdDb || null,
          duration_ms: tr.duration_ms || null,
          local_audio_url: tr.local_audio_url || null,
          spotify_external_url: tr.external_urls && tr.external_urls.spotify ? tr.external_urls.spotify : (tr.external_urls ? JSON.stringify(tr.external_urls) : null),
          images: tr.album && tr.album.images ? tr.album.images : (tr.images || null),
          is_featured: tr.is_featured || 0,
          is_popular: markPopular ? 1 : 0,
          order_index: tr.order_index || 0
        }, { transaction: t });
      } catch (err) {
        console.error('persistTracks internal error for track', tr && tr.id, err);
        // continue on error for each track
      }
    }
  });
};

// Spotify configuration
const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';
const SB19_ARTIST_ID = '3g7vYcdDXnqnDKYFwqXBJP';

// Member Spotify IDs
const MEMBER_IDS = {
  'pablo': '7wY8cwtF13xDJIHO7htMNk',
  'josh': '3xn2W0ziGURPYJj372a6jQ',
  'stell': '4bpUKZGsImgabgDABbThr0',
  'felip': '2tEFDBihLXytoPl4xdResl',
  'justin': '20XuMlpFudMP9rDHMTkyar'
};

// Reverse mapping: Spotify ID to member name
const ID_TO_MEMBER = {
  '7wY8cwtF13xDJIHO7htMNk': 'pablo',
  '3xn2W0ziGURPYJj372a6jQ': 'josh',
  '4bpUKZGsImgabgDABbThr0': 'stell',
  '2tEFDBihLXytoPl4xdResl': 'felip',
  '20XuMlpFudMP9rDHMTkyar': 'justin'
};

// Use shared Spotify helper (get token + request) from spotifyController

// Check if local audio file exists
const checkLocalAudio = (spotifyId) => {
  const folders = ['sb19', 'pablo', 'josh', 'justin', 'stell', 'felip'];
  
  for (const folder of folders) {
    const audioPath = path.join(__dirname, '../../public/audio', folder, `${spotifyId}.mp3`);
    if (fs.existsSync(audioPath)) {
      return `/audio/${folder}/${spotifyId}.mp3`;
    }
  }
  
  // Check flat structure
  const flatPath = path.join(__dirname, '../../public/audio', `${spotifyId}.mp3`);
  if (fs.existsSync(flatPath)) {
    return `/audio/${spotifyId}.mp3`;
  }
  
  return null;
};

// Get SB19 popular tracks
export const getSB19PopularTracks = async (req, res) => {
  try {
    // Fetch from Spotify API via shared helper
    const data = await makeSpotifyRequest(`/artists/${SB19_ARTIST_ID}/top-tracks`, { market: 'PH' });

    // Format tracks and check for local audio
    const formattedTracks = data.tracks.map(track => {
      const localAudioUrl = checkLocalAudio(track.id);
      
      return {
        id: track.id,
        name: track.name,
        artists: track.artists,
        album: track.album,
        duration_ms: track.duration_ms,
        preview_url: localAudioUrl || track.preview_url,
        local_audio_url: localAudioUrl,
        external_urls: track.external_urls
      };
    });

    // Persist popular tracks so next time we serve from DB
    try {
      await persistTracks(formattedTracks, true);
    } catch (errPersist) {
      console.error('Failed to persist popular tracks:', errPersist);
    }

    res.json({ tracks: formattedTracks });
  } catch (error) {
    console.error('Get SB19 popular tracks error:', error);
    res.status(500).json({ message: 'Failed to get popular tracks', error: error.message });
  }
};

// Get member tracks
export const getMemberTracks = async (req, res) => {
  try {
    const { memberId } = req.params;

    // Check if memberId is a Spotify ID or member name
    let artistId = MEMBER_IDS[memberId.toLowerCase()];
    let memberName = memberId.toLowerCase();

    // If not found, check if it's a Spotify ID
    if (!artistId) {
      memberName = ID_TO_MEMBER[memberId];
      artistId = memberId;

      if (!memberName) {
        return res.status(404).json({ message: 'Member not found' });
      }
    }

    // Try to load artist from DB
    let artistInstance = null;
    try {
      if (artistId) {
        artistInstance = await Artist.findOne({ where: { spotify_id: artistId } });
      }
      if (!artistInstance) {
        // case-insensitive name search
        artistInstance = await Artist.findOne({ where: sequelize.where(sequelize.fn('LOWER', sequelize.col('name')), memberName) });
      }
    } catch (err) {
      console.error('Artist lookup error:', err);
      artistInstance = null;
    }

    if (artistInstance) {
      const memberTracks = await Track.findAll({
        where: { artist_id: artistInstance.id },
        include: [
          { model: Artist, as: 'artist', attributes: ['name', 'spotify_id'] },
          { model: Album, as: 'album', attributes: ['name', 'images'] }
        ],
        order: [['order_index', 'ASC'], ['id', 'DESC']]
      });

      if (memberTracks && memberTracks.length > 0) {
        const formatted = memberTracks.map(track => {
          const localAudioUrl = checkLocalAudio(track.spotify_track_id || track.spotify_id);
          const albumImages = track.album && track.album.images ? (typeof track.album.images === 'string' ? JSON.parse(track.album.images) : track.album.images) : [];

          return {
            id: track.spotify_track_id || track.spotify_id,
            name: track.title,
            artists: [{ name: track.artist ? track.artist.name : artistInstance.name }],
            album: { name: track.album ? track.album.name : null, images: albumImages },
            duration_ms: track.duration_ms,
            preview_url: localAudioUrl || track.spotify_external_url,
            local_audio_url: localAudioUrl,
            external_urls: { spotify: track.spotify_external_url }
          };
        });

        return res.json({ tracks: formatted });
      }
    }

    // If no DB rows, fetch from Spotify API via shared helper
    const data = await makeSpotifyRequest(`/artists/${artistId}/top-tracks`, { market: 'PH' });

    // Format tracks and check for local audio
    const formattedTracks = data.tracks.map(track => {
      const localAudioUrl = checkLocalAudio(track.id);
      
      return {
        id: track.id,
        name: track.name,
        artists: track.artists,
        album: track.album,
        duration_ms: track.duration_ms,
        preview_url: localAudioUrl || track.preview_url,
        local_audio_url: localAudioUrl,
        external_urls: track.external_urls
      };
    });

    // Persist fetched member tracks to DB for caching
    try {
      await persistTracks(formattedTracks, false);
    } catch (errPersist) {
      console.error('Failed to persist member tracks:', errPersist);
    }

    res.json({ tracks: formattedTracks });
  } catch (error) {
    console.error('Get member tracks error:', error);
    res.status(500).json({ message: 'Failed to get member tracks', error: error.message });
  }
};

// Get all tracks
export const getAllTracks = async (req, res) => {
  try {
    const dbTracks = await Track.findAll({
      include: [
        { model: Artist, as: 'artist', attributes: ['name', 'spotify_id'] },
        { model: Album, as: 'album', attributes: ['name', 'images'] }
      ],
      order: [['order_index', 'ASC'], ['id', 'DESC']]
    });

    if (dbTracks && dbTracks.length > 0) {
      const formattedTracks = dbTracks.map(track => {
        const localAudioUrl = checkLocalAudio(track.spotify_track_id || track.spotify_id);
        const albumImages = track.album && track.album.images ? (typeof track.album.images === 'string' ? JSON.parse(track.album.images) : track.album.images) : [];

        return {
          id: track.spotify_track_id || track.spotify_id,
          name: track.title,
          artists: [{ name: track.artist ? track.artist.name : null }],
          album: {
            name: track.album ? track.album.name : null,
            images: albumImages
          },
          duration_ms: track.duration_ms,
          preview_url: localAudioUrl || track.spotify_external_url,
          local_audio_url: localAudioUrl,
          external_urls: { spotify: track.spotify_external_url }
        };
      });

      return res.json({ tracks: formattedTracks });
    }

  // If DB empty, fetch from Spotify and persist results
  const data = await makeSpotifyRequest(`/artists/${SB19_ARTIST_ID}/top-tracks`, { market: 'PH' });

    const formattedTracks = data.tracks.map(track => {
      const localAudioUrl = checkLocalAudio(track.id);
      
      return {
        id: track.id,
        name: track.name,
        artists: track.artists,
        album: track.album,
        duration_ms: track.duration_ms,
        preview_url: localAudioUrl || track.preview_url,
        local_audio_url: localAudioUrl,
        external_urls: track.external_urls
      };
    });

    // Persist fetched tracks so DB will have cached data
    try {
      await persistTracks(formattedTracks, true);
    } catch (errPersist) {
      console.error('Failed to persist tracks from getAllTracks:', errPersist);
    }

    return res.json({ tracks: formattedTracks });
  } catch (error) {
    console.error('Get all tracks error:', error);
    res.status(500).json({ message: 'Failed to get tracks', error: error.message });
  }
};

// Get track by ID
export const getTrackById = async (req, res) => {
  try {
    const { id } = req.params;

    // Try DB first using Sequelize
    const dbTrack = await Track.findOne({
      where: {
        [Op.or]: [
          { spotify_track_id: id },
          { spotify_id: id },
          { id: id }
        ]
      },
      include: [
        { model: Artist, as: 'artist', attributes: ['name', 'spotify_id'] },
        { model: Album, as: 'album', attributes: ['name', 'images'] }
      ]
    });

    if (!dbTrack) {
      // If not in DB, fetch from Spotify directly (do not persist automatically)
      try {
        const spotifyTrack = await makeSpotifyRequest(`/tracks/${id}`);
        const localAudioUrl = checkLocalAudio(spotifyTrack.id);

        const formattedTrack = {
          id: spotifyTrack.id,
          name: spotifyTrack.name,
          artists: spotifyTrack.artists,
          album: spotifyTrack.album,
          duration_ms: spotifyTrack.duration_ms,
          preview_url: localAudioUrl || spotifyTrack.preview_url,
          local_audio_url: localAudioUrl,
          external_urls: spotifyTrack.external_urls
        };

        return res.json({ track: formattedTrack });
      } catch (err) {
        console.error('Get track: not found in DB and failed to fetch from Spotify', err);
        return res.status(404).json({ message: 'Track not found' });
      }
    }

    const localAudioUrl = checkLocalAudio(dbTrack.spotify_track_id || dbTrack.spotify_id);
    const albumImages = dbTrack.album && dbTrack.album.images ? (typeof dbTrack.album.images === 'string' ? JSON.parse(dbTrack.album.images) : dbTrack.album.images) : [];

    const formattedTrack = {
      id: dbTrack.spotify_track_id || dbTrack.spotify_id,
      name: dbTrack.title,
      artists: [{ name: dbTrack.artist ? dbTrack.artist.name : null }],
      album: {
        name: dbTrack.album ? dbTrack.album.name : null,
        images: albumImages
      },
      duration_ms: dbTrack.duration_ms,
      preview_url: localAudioUrl || dbTrack.spotify_external_url,
      local_audio_url: localAudioUrl,
      external_urls: { spotify: dbTrack.spotify_external_url }
    };

    res.json({ track: formattedTrack });
  } catch (error) {
    console.error('Get track error:', error);
    res.status(500).json({ message: 'Failed to get track', error: error.message });
  }
};

// Import tracks into DB (called after user confirmation). Accepts either:
// { tracks: [ ... ] } where each track is Spotify track object (id, name, artists, album, duration_ms, external_urls, images)
// or { artistId: 'spotifyArtistId' } to fetch server-side then import.
export const importTracks = async (req, res) => {
  const { tracks: incomingTracks, artistId } = req.body || {};

  try {
    let tracksToImport = incomingTracks;

    if (!tracksToImport || !Array.isArray(tracksToImport)) {
      if (!artistId) return res.status(400).json({ message: 'Provide tracks array or artistId to import' });
      const data = await makeSpotifyRequest(`/artists/${artistId}/top-tracks`, { market: 'PH' });
      tracksToImport = data.tracks || [];
    }

    if (!Array.isArray(tracksToImport) || tracksToImport.length === 0) {
      return res.status(400).json({ message: 'No tracks to import' });
    }

    const summary = { inserted: 0, skipped: 0, errors: [] };

    await sequelize.transaction(async (t) => {
      for (const track of tracksToImport) {
        try {
          // artist (take first)
          const primaryArtist = (track.artists && track.artists[0]) || null;
          const artistName = primaryArtist ? primaryArtist.name : 'Unknown Artist';
          const artistSpotifyId = primaryArtist ? primaryArtist.id : null;

          // upsert artist using Artist model (transaction-aware)
          let artistIdDb = null;
          if (artistSpotifyId) {
            const [artistInstance, created] = await Artist.findOrCreate({
              where: { spotify_id: artistSpotifyId },
              defaults: { name: artistName, spotify_id: artistSpotifyId },
              transaction: t
            });

            // ensure name is up to date
            if (!created && artistInstance.name !== artistName) {
              artistInstance.name = artistName;
              await artistInstance.save({ transaction: t });
            }

            artistIdDb = artistInstance.id;
          } else {
            const [artistInstance] = await Artist.findOrCreate({
              where: { name: artistName },
              defaults: { name: artistName },
              transaction: t
            });
            artistIdDb = artistInstance.id;
          }

          // album upsert using Album model
          let albumIdDb = null;
          if (track.album && track.album.id) {
            const albumSpotifyId = track.album.id;
            const albumName = track.album.name || 'Unknown Album';
            const albumImages = track.album.images || null;

            const [albumInstance] = await Album.findOrCreate({
              where: { spotify_id: albumSpotifyId },
              defaults: { spotify_id: albumSpotifyId, name: albumName, images: albumImages },
              transaction: t
            });

            // update name/images if needed
            if ((albumInstance.name !== albumName) || (JSON.stringify(albumInstance.images) !== JSON.stringify(albumImages))) {
              albumInstance.name = albumName;
              albumInstance.images = albumImages;
              await albumInstance.save({ transaction: t });
            }

            albumIdDb = albumInstance.id;
          }

          // check if track exists
          const spotifyTrackId = track.id || track.spotify_track_id || null;
          if (!spotifyTrackId) {
            summary.skipped++;
            continue;
          }

          const existing = await Track.findOne({ where: { spotify_track_id: spotifyTrackId }, transaction: t });
          if (existing) {
            summary.skipped++;
            continue;
          }

          // insert track via model
          await Track.create({
            spotify_track_id: spotifyTrackId,
            title: track.name || track.title || '',
            artist_id: artistIdDb,
            album_id: albumIdDb,
            duration_ms: track.duration_ms || null,
            local_audio_url: null,
            spotify_external_url: track.external_urls && track.external_urls.spotify ? track.external_urls.spotify : (track.external_urls ? JSON.stringify(track.external_urls) : null),
            images: track.album && track.album.images ? track.album.images : (track.images || null),
            is_featured: 0,
            order_index: 0
          }, { transaction: t });

          summary.inserted++;
        } catch (errTrack) {
          console.error('Import track error for', track && (track.id || track.spotify_track_id), errTrack);
          summary.errors.push({ track: track && (track.id || track.spotify_track_id), error: errTrack.message });
        }
      }
    });

    return res.json({ message: 'Import completed', summary });
  } catch (error) {
    console.error('Import tracks error:', error);
    res.status(500).json({ message: 'Failed to import tracks', error: error.message });
  }
};
