import express from 'express';
import { body } from 'express-validator';
import * as authController from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Register Routes
router.post('/register', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
], authController.register);

// Login Routes
router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], authController.login);

// Logout Route
router.post('/logout', authenticate, authController.logout);

// Get current user
router.get('/user', authenticate, authController.getUser);

// Forgot password
router.post('/forgot-password', [
  body('email').isEmail().withMessage('Valid email is required')
], authController.forgotPassword);

// Reset password
router.post('/reset-password', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('token').notEmpty().withMessage('Token is required')
], authController.resetPassword);

// Confirm password
router.post('/confirm-password', authenticate, [
  body('password').notEmpty().withMessage('Password is required')
], authController.confirmPassword);

// Spotify OAuth Routes
router.get('/spotify', authController.spotifyAuth);
router.get('/spotify/callback', authController.spotifyCallback);

export default router;
