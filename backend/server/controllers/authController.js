import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import crypto from 'crypto';

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'your-jwt-secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Register
export const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(422).json({ 
        errors: [{ msg: 'Email already exists', param: 'email' }] 
      });
    }

    // Create user
    const user = await User.create({ name, email, password });

    // Generate token
    const token = generateToken(user.id);

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: user.toSafeObject(),
      token
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { email, password, remember } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(422).json({ 
        errors: [{ msg: 'Invalid credentials', param: 'email' }] 
      });
    }

    // Validate password
    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      return res.status(422).json({ 
        errors: [{ msg: 'Invalid credentials', param: 'email' }] 
      });
    }

    // Generate token
    const token = generateToken(user.id);

    // Set cookie
    const maxAge = remember ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000;
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge
    });

    res.json({
      message: 'Login successful',
      user: user.toSafeObject(),
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Logout
export const logout = async (req, res) => {
  try {
    res.clearCookie('token');
    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get current user
export const getUser = async (req, res) => {
  try {
    res.json({ user: req.user.toSafeObject() });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Verify email
export const verifyEmail = async (req, res) => {
  try {
    const { id, hash } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify hash (simple implementation - in production use proper hashing)
    const expectedHash = crypto
      .createHash('sha256')
      .update(user.email)
      .digest('hex');

    if (hash !== expectedHash) {
      return res.status(400).json({ message: 'Invalid verification link' });
    }

    // Mark email as verified
    user.email_verified_at = new Date();
    await user.save();

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Verify email error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Send verification email
export const sendVerificationEmail = async (req, res) => {
  try {
    if (req.user.email_verified_at) {
      return res.status(400).json({ message: 'Email already verified' });
    }

    // In production, send actual email
    // For now, just return success
    res.json({ message: 'Verification email sent' });
  } catch (error) {
    console.error('Send verification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Forgot password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      // Don't reveal if user exists
      return res.json({ message: 'Password reset link sent if email exists' });
    }

    // In production, generate token and send email
    // For now, just return success
    res.json({ message: 'Password reset link sent' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Reset password
export const resetPassword = async (req, res) => {
  try {
    const { email, password, token } = req.body;

    // In production, verify token
    // For now, simple implementation
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid reset token' });
    }

    user.password = password;
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Confirm password
export const confirmPassword = async (req, res) => {
  try {
    const { password } = req.body;

    const isValidPassword = await req.user.validatePassword(password);
    if (!isValidPassword) {
      return res.status(422).json({ 
        errors: [{ msg: 'Invalid password', param: 'password' }] 
      });
    }

    res.json({ message: 'Password confirmed' });
  } catch (error) {
    console.error('Confirm password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Spotify OAuth - redirect to Spotify
export const spotifyAuth = (req, res) => {
  const scopes = 'user-read-email user-read-private';
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI;
  const clientId = process.env.SPOTIFY_CLIENT_ID;

  const authUrl = `https://accounts.spotify.com/authorize?` +
    `client_id=${clientId}&` +
    `response_type=code&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `scope=${encodeURIComponent(scopes)}`;

  res.redirect(authUrl);
};

// Spotify OAuth callback
export const spotifyCallback = async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=spotify_auth_failed`);
    }

    // Exchange code for tokens (implement Spotify token exchange)
    // For now, redirect to frontend
    res.redirect(`${process.env.FRONTEND_URL}?spotify_auth=success`);
  } catch (error) {
    console.error('Spotify callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=spotify_auth_failed`);
  }
};
