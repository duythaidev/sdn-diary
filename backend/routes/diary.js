import express from 'express';
import { body } from 'express-validator';
import {
  getUserDiaries,
  getPublicDiaries,
  getDiaryById,
  createDiary,
  updateDiary,
  deleteDiary,
} from '../controllers/diaryController.js';
import { verifyAccessToken } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';
const router = express.Router();
// Validation rules
const diaryValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Content is required'),
  body('isPublic')
    .optional()
    .isBoolean()
    .withMessage('isPublic must be a boolean'),
];
const updateDiaryValidation = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  body('content')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Content cannot be empty'),
  body('isPublic')
    .optional()
    .isBoolean()
    .withMessage('isPublic must be a boolean'),
];
// Routes
router.get('/', verifyAccessToken, getUserDiaries);
router.get('/public', getPublicDiaries);
router.get('/:id', getDiaryById);
router.post('/', verifyAccessToken, diaryValidation, validate, createDiary);
router.put('/:id', verifyAccessToken, updateDiaryValidation, validate, updateDiary);
router.delete('/:id', verifyAccessToken, deleteDiary);
export default router;