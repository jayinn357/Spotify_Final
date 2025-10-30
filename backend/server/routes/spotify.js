import express from 'express';
import * as spotifyController from '../controllers/spotifyController.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Search
router.get('/search', optionalAuth, spotifyController.search);

// Get artist
router.get('/artists/:id', optionalAuth, spotifyController.getArtist);

// Get artist's top tracks
router.get('/artists/:id/top-tracks', optionalAuth, spotifyController.getArtistTopTracks);

// Get album
router.get('/albums/:id', optionalAuth, spotifyController.getAlbum);

// Get album tracks
router.get('/albums/:id/tracks', optionalAuth, spotifyController.getAlbumTracks);

// Get track
router.get('/tracks/:id', optionalAuth, spotifyController.getTrack);

export default router;
