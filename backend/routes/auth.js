import express from 'express';
import { body } from 'express-validator';
import { 
  register, 
  login, 
  refresh, 
  logout, 
  getMe 
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
// Routes
router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', verifyAccessToken, getMe);
export default router;