import express from 'express';
import {
  // Artists
  getAllArtists,
  updateArtist,
  // About Origins
  getAllAboutOrigins,
  createAboutOrigin,
  updateAboutOrigin,
  deleteAboutOrigin,
  // About Achievements
  getAllAboutAchievements,
  createAboutAchievement,
  updateAboutAchievement,
  deleteAboutAchievement,
  // About Footer
  getAllAboutFooter,
  updateAboutFooter,
  deleteAboutFooter,
  // Track Messages
  getAllTrackMessages,
  getTrackMessageByTrackId,
  createTrackMessage,
  updateTrackMessage,
  deleteTrackMessage,
  // Tracks Audio
  getTracksWithoutAudio,
  getTracksWithoutMessages,
  updateTrackAudio
} from '../controllers/crudController.js';

import { upload, uploadImage, uploadAudio, uploadTrackAudio } from '../controllers/uploadController.js';

const router = express.Router();

// image upload route
router.post('/upload-image', upload.single('image'), uploadImage);

// audio upload route
router.post('/tracks/:trackId/upload-audio', uploadAudio.single('audio'), uploadTrackAudio);

// artists routes
router.get('/artists', getAllArtists);
router.put('/artists/:id', updateArtist);

// about origins routes
router.get('/about-origins', getAllAboutOrigins);
router.post('/about-origins', createAboutOrigin);
router.put('/about-origins/:id', updateAboutOrigin);
router.delete('/about-origins/:id', deleteAboutOrigin);

// about achievements routes
router.get('/about-achievements', getAllAboutAchievements);
router.post('/about-achievements', createAboutAchievement);
router.put('/about-achievements/:id', updateAboutAchievement);
router.delete('/about-achievements/:id', deleteAboutAchievement);

// about footer routes
router.get('/about-footer', getAllAboutFooter);
router.put('/about-footer/:id', updateAboutFooter);
router.delete('/about-footer/:id', deleteAboutFooter);

// track messages routes
router.get('/track-messages', getAllTrackMessages);
router.get('/track-messages/track/:trackId', getTrackMessageByTrackId);
router.post('/track-messages', createTrackMessage);
router.put('/track-messages/:id', updateTrackMessage);
router.delete('/track-messages/:id', deleteTrackMessage);

// tracks audio routes
router.get('/tracks/without-audio', getTracksWithoutAudio);
router.get('/tracks/without-messages', getTracksWithoutMessages);
router.put('/tracks/:id/audio', updateTrackAudio);

export default router;
