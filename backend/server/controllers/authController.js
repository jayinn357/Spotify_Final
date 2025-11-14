// imports
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import crypto from 'crypto';

// Generates token using JWT (JSON Web Token) - valid for 7 days, so relogin required after
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'your-jwt-secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Register Function - validate if inputs are provided correctly
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

    const token = generateToken(user.id);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000 
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

// Login - existing user
export const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { email, password, remember } = req.body;

    // Find user in the database 
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(422).json({ 
        errors: [{ msg: 'Invalid credentials', param: 'email' }] 
      });
    }

    // Check if password matches (bcrypt comparison)
    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      return res.status(422).json({ 
        errors: [{ msg: 'Invalid credentials', param: 'email' }] 
      });
    }

    const token = generateToken(user.id);

    // stores cookie for 7 days if 'remember me' is checked
    const maxAge = remember ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000;
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', //allows cookie when frontend/backend on different ports
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

// Get current user - returns infor about the currently logged-in user
export const getUser = async (req, res) => {
  try {
    res.json({ user: req.user.toSafeObject() });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Forgot password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.json({ message: 'Password reset link sent if email exists' });
    }

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

    // For now, redirect to frontend
    res.redirect(`${process.env.FRONTEND_URL}?spotify_auth=success`);
  } catch (error) {
    console.error('Spotify callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=spotify_auth_failed`);
  }
};
