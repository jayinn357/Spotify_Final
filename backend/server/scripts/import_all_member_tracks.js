import sequelize from '../config/database.js';
import { Op } from 'sequelize';
import Artist from '../models/Artist.js';
import Album from '../models/Album.js';
import Track from '../models/Track.js';
import '../models/index.js';
import { makeSpotifyRequest } from '../controllers/spotifyController.js';
import dotenv from 'dotenv';

dotenv.config();

// Import ALL tracks for SB19 and each member by fetching albums then album tracks
async function importAllMemberTracks() {
  try {
    console.log('Starting comprehensive track import...\n');

    await sequelize.authenticate();
    console.log('Database connected.\n');

    // Get ONLY SB19 and its 5 members
    const targetArtistNames = ['SB19', 'Pablo', 'Josh', 'Stell', 'Ken', 'Justin'];
    const artists = await Artist.findAll({
      where: {
        name: { [Op.in]: targetArtistNames },
        spotify_id: { [Op.ne]: null }
      }
    });

    console.log(`Found ${artists.length} artists to process:\n`);
    artists.forEach(a => console.log(`  - ${a.name} (${a.spotify_id})`));
    console.log('');

    let totalTracksInserted = 0;
    let totalTracksSkipped = 0;

    for (const artist of artists) {
      console.log(`\nProcessing ${artist.name}...`);

      try {
        // Fetch artist's albums
        const albumsData = await makeSpotifyRequest(`/artists/${artist.spotify_id}/albums`, {
          include_groups: 'album,single',
          market: 'PH',
          limit: 50
        });

        const albums = albumsData.items || [];
        console.log(`Found ${albums.length} albums/singles`);

        for (const albumItem of albums) {
          try {
            // Fetch full album details to get tracks
            const albumDetails = await makeSpotifyRequest(`/albums/${albumItem.id}`, { market: 'PH' });
            
            const albumTracks = albumDetails.tracks.items || [];
            console.log(`Album: "${albumDetails.name}" - ${albumTracks.length} tracks`);

            // upsert album
            const [albumInstance] = await Album.findOrCreate({
              where: { spotify_id: albumDetails.id },
              defaults: {
                spotify_id: albumDetails.id,
                name: albumDetails.name,
                images: albumDetails.images || null
              }
            });

            // Update album if needed
            if (albumInstance.name !== albumDetails.name || JSON.stringify(albumInstance.images) !== JSON.stringify(albumDetails.images)) {
              albumInstance.name = albumDetails.name;
              albumInstance.images = albumDetails.images;
              await albumInstance.save();
            }

            // Process each track in the album
            for (const track of albumTracks) {
              try {
                // Check if track already exists
                const existing = await Track.findOne({ where: { spotify_track_id: track.id } });
                if (existing) {
                  totalTracksSkipped++;
                  continue;
                }

                // ONLY import tracks where the PRIMARY artist (first in the array) is the current artist
                // This ensures we get their songs (including collabs where they're the primary artist)
                const primaryArtistId = track.artists[0]?.id;
                
                if (primaryArtistId !== artist.spotify_id) {
                  totalTracksSkipped++;
                  continue;
                }

                // This track belongs to the current artist, create it
                const trackArtistId = artist.id;
                await Track.create({
                  spotify_track_id: track.id,
                  spotify_id: track.id,
                  title: track.name,
                  artist_id: trackArtistId,
                  album_id: albumInstance.id,
                  duration_ms: track.duration_ms,
                  local_audio_url: null,
                  spotify_external_url: track.external_urls?.spotify || null,
                  images: albumDetails.images || null,
                  is_featured: 0,
                  is_popular: 0, // mark popular later, code below
                  order_index: track.track_number || 0
                });

                totalTracksInserted++;
              } catch (trackError) {
                console.error(`Error importing track "${track.name}":`, trackError.message);
              }
            }

            // Small delay to respect Spotify rate limits
            await new Promise(resolve => setTimeout(resolve, 100));
          } catch (albumError) {
            console.error(`Error fetching album "${albumItem.name}":`, albumError.message);
          }
        }

        console.log(`Completed ${artist.name}`);
      } catch (artistError) {
        console.error(`Error processing ${artist.name}:`, artistError.message);
      }
    }

    // Now mark popular tracks (marked means top tracks for SB19)
    console.log('\n\nMarking popular tracks...');
    try {
      const sb19Artist = artists.find(a => a.name === 'SB19');
      if (sb19Artist) {
        const topTracksData = await makeSpotifyRequest(`/artists/${sb19Artist.spotify_id}/top-tracks`, { market: 'PH' });
        const topTrackIds = topTracksData.tracks.map(t => t.id);

        await Track.update(
          { is_popular: true },
          { where: { spotify_track_id: topTrackIds } }
        );

        console.log(`Marked ${topTrackIds.length} tracks as popular`);
      }
    } catch (popularError) {
      console.error('Error marking popular tracks:', popularError.message);
    }

    console.log('\n\nImport Summary:');
    console.log(`Tracks inserted: ${totalTracksInserted}`);
    console.log(`Tracks skipped (already exist): ${totalTracksSkipped}`);

    // counts per artist
    console.log('\nTracks per artist:');
    for (const artist of artists) {
      const count = await Track.count({ where: { artist_id: artist.id } });
      console.log(`  - ${artist.name}: ${count} tracks`);
    }

    const totalTracks = await Track.count();
    console.log(`\nTotal tracks in database: ${totalTracks}`);

    console.log('\nImport completed successfully!\n');
    process.exit(0);
  } catch (error) {
    console.error('\nImport failed:', error);
    console.error(error.stack);
    process.exit(1);
  }
}

importAllMemberTracks();
