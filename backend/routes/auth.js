import express from 'express';
import { body } from 'express-validator';
import passport from 'passport';
import {
  register,
  login,
  refresh,
  logout,
  getMe,
  updateProfile,
  googleCallback
} from '../controllers/authController.js';
import { verifyAccessToken } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';
const router = express.Router();
// Validation rules
const registerValidation = [
  body('username')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];
const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

const updateProfileValidation = [
  body('username')
    .optional()
    .trim()
    .isLength({ min: 2, max: 30 })
    .withMessage('Username must be between 2 and 30 characters'),
  body('bio')
    .optional(),
  body('profileImage')
    .optional()
    .custom((value) => {
      if (value === null) return true;
      if (typeof value === 'string' && value.startsWith('data:image/')) return true;
      if (typeof value === 'string' && value.startsWith('http')) return true;
      throw new Error('Invalid profile image format');
    }),
  body('urls')
    .optional()
    .isArray()
    .withMessage('URLs must be an array'),
  body('urls.*.value')
    .optional()
    .isURL()
    .withMessage('Each URL must be valid'),
];
// Routes
router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', verifyAccessToken, getMe);
router.put('/profile', verifyAccessToken, updateProfileValidation, validate, updateProfile);

// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  googleCallback
);

export default router;