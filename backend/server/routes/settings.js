import express from 'express';
import { body } from 'express-validator';
import * as settingsController from '../controllers/settingsController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Profile routes
router.get('/profile', authenticate, settingsController.getProfile);

router.patch('/profile', authenticate, [
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('email').optional().isEmail().withMessage('Valid email is required')
], settingsController.updateProfile);

router.delete('/profile', authenticate, [
  body('password').notEmpty().withMessage('Password is required')
], settingsController.deleteProfile);

// Password routes
router.put('/password', authenticate, [
  body('current_password').notEmpty().withMessage('Current password is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
], settingsController.updatePassword);

export default router;
