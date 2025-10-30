import { validationResult } from 'express-validator';
import User from '../models/User.js';

// Get profile
export const getProfile = async (req, res) => {
  try {
    res.json({ 
      user: req.user.toSafeObject(),
      status: 'profile-information-updated' 
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update profile
export const updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { name, email } = req.body;
    const user = req.user;

    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(422).json({ 
          errors: [{ msg: 'Email already exists', param: 'email' }] 
        });
      }
      
      // Reset email verification if email changed
      user.email_verified_at = null;
    }

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();

    res.json({ 
      message: 'Profile updated successfully',
      user: user.toSafeObject() 
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete profile
export const deleteProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { password } = req.body;
    const user = req.user;

    // Verify password
    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      return res.status(422).json({ 
        errors: [{ msg: 'Invalid password', param: 'password' }] 
      });
    }

    // Delete user
    await user.destroy();

    // Clear cookie
    res.clearCookie('token');

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update password
export const updatePassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { current_password, password } = req.body;
    const user = req.user;

    // Verify current password
    const isValidPassword = await user.validatePassword(current_password);
    if (!isValidPassword) {
      return res.status(422).json({ 
        errors: [{ msg: 'Current password is incorrect', param: 'current_password' }] 
      });
    }

    // Update password
    user.password = password;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
