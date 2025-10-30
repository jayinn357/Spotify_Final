import axios from 'axios';
import qs from 'qs';

// Spotify API base URL
const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';

// Get Spotify access token using client credentials
export const getSpotifyToken = async () => {
  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      qs.stringify({ grant_type: 'client_credentials' }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + Buffer.from(
            `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
          ).toString('base64')
        }
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error('Error getting Spotify token:', error.response?.data || error.message);
    throw new Error('Failed to get Spotify access token');
  }
};

// Make Spotify API request
export const makeSpotifyRequest = async (endpoint, params = {}) => {
  try {
    const token = await getSpotifyToken();
    const response = await axios.get(`${SPOTIFY_API_BASE}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      params
    });
    return response.data;
  } catch (error) {
    console.error('Spotify API error:', error.response?.data || error.message);
    throw error;
  }
};

// Search
export const search = async (req, res) => {
  try {
    const { q, type = 'track', limit = 10, market = 'PH' } = req.query;

    if (!q) {
      return res.status(400).json({ message: 'Search query required' });
    }

    const data = await makeSpotifyRequest('/search', {
      q,
      type,
      limit,
      market
    });

    res.json(data);
  } catch (error) {
    console.error('Search error:', error);
    res.status(error.response?.status || 500).json({ 
      message: error.response?.data?.error?.message || 'Search failed' 
    });
  }
};

// Get artist
export const getArtist = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await makeSpotifyRequest(`/artists/${id}`);
    res.json(data);
  } catch (error) {
    console.error('Get artist error:', error);
    res.status(error.response?.status || 500).json({ 
      message: error.response?.data?.error?.message || 'Failed to get artist' 
    });
  }
};

// Get artist's top tracks
export const getArtistTopTracks = async (req, res) => {
  try {
    const { id } = req.params;
    const { market = 'PH' } = req.query;

    const data = await makeSpotifyRequest(`/artists/${id}/top-tracks`, { market });
    
    res.json(data);
  } catch (error) {
    console.error('Get artist top tracks error:', error);
    res.status(error.response?.status || 500).json({ 
      message: error.response?.data?.error?.message || 'Failed to get top tracks' 
    });
  }
};

// Get album
export const getAlbum = async (req, res) => {
  try {
    const { id } = req.params;
    const { market = 'PH' } = req.query;

    const data = await makeSpotifyRequest(`/albums/${id}`, { market });
    res.json(data);
  } catch (error) {
    console.error('Get album error:', error);
    res.status(error.response?.status || 500).json({ 
      message: error.response?.data?.error?.message || 'Failed to get album' 
    });
  }
};

// Get album tracks
export const getAlbumTracks = async (req, res) => {
  try {
    const { id } = req.params;
    const { market = 'PH', limit = 50 } = req.query;

    const albumData = await makeSpotifyRequest(`/albums/${id}`, { market });
    
    // Return tracks with album info
    const tracks = albumData.tracks.items.map(track => ({
      ...track,
      album: {
        id: albumData.id,
        name: albumData.name,
        images: albumData.images,
        release_date: albumData.release_date
      }
    }));

    res.json({ tracks });
  } catch (error) {
    console.error('Get album tracks error:', error);
    res.status(error.response?.status || 500).json({ 
      message: error.response?.data?.error?.message || 'Failed to get album tracks' 
    });
  }
};

// Get track
export const getTrack = async (req, res) => {
  try {
    const { id } = req.params;
    const { market = 'PH' } = req.query;

    const data = await makeSpotifyRequest(`/tracks/${id}`, { market });
    res.json(data);
  } catch (error) {
    console.error('Get track error:', error);
    res.status(error.response?.status || 500).json({ 
      message: error.response?.data?.error?.message || 'Failed to get track' 
    });
  }
};
