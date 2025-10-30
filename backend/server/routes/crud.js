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
  // Track Messages
  getAllTrackMessages,
  getTrackMessageByTrackId,
  createTrackMessage,
  updateTrackMessage,
  deleteTrackMessage
} from '../controllers/crudController.js';

import { upload, uploadImage } from '../controllers/uploadController.js';

const router = express.Router();

// ===== IMAGE UPLOAD ROUTE =====
router.post('/upload-image', upload.single('image'), uploadImage);

// ===== ARTISTS ROUTES =====
router.get('/artists', getAllArtists);
router.put('/artists/:id', updateArtist);

// ===== ABOUT ORIGINS ROUTES =====
router.get('/about-origins', getAllAboutOrigins);
router.post('/about-origins', createAboutOrigin);
router.put('/about-origins/:id', updateAboutOrigin);
router.delete('/about-origins/:id', deleteAboutOrigin);

// ===== ABOUT ACHIEVEMENTS ROUTES =====
router.get('/about-achievements', getAllAboutAchievements);
router.post('/about-achievements', createAboutAchievement);
router.put('/about-achievements/:id', updateAboutAchievement);
router.delete('/about-achievements/:id', deleteAboutAchievement);

// ===== ABOUT FOOTER ROUTES =====
router.get('/about-footer', getAllAboutFooter);
router.put('/about-footer/:id', updateAboutFooter);

// ===== TRACK MESSAGES ROUTES =====
router.get('/track-messages', getAllTrackMessages);
router.get('/track-messages/track/:trackId', getTrackMessageByTrackId);
router.post('/track-messages', createTrackMessage);
router.put('/track-messages/:id', updateTrackMessage);
router.delete('/track-messages/:id', deleteTrackMessage);

export default router;
