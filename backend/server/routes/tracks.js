import express from 'express';
import * as trackController from '../controllers/trackController.js';

const router = express.Router();

// Get SB19 popular tracks (public - no auth required)
router.get('/sb19/popular', trackController.getSB19PopularTracks);

// Get member tracks (public - no auth required)
router.get('/member/:memberId', trackController.getMemberTracks);

// Import tracks into DB after user confirmation
router.post('/import', trackController.importTracks);

// Get all tracks (public - no auth required)
router.get('/', trackController.getAllTracks);

// Get track by ID (public - no auth required)
router.get('/:id', trackController.getTrackById);

export default router;
