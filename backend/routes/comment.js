import express from 'express';
import { body } from 'express-validator';
import { createComment, deleteComment } from '../controllers/commentController.js';
import { verifyAccessToken } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';
const router = express.Router();
// Validation rules
const commentValidation = [
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Comment content is required')
    .isLength({ max: 500 })
    .withMessage('Comment cannot exceed 500 characters'),
  body('diaryId')
    .notEmpty()
    .withMessage('Diary ID is required')
    .isMongoId()
    .withMessage('Invalid diary ID'),
];
// Routes
router.post('/', verifyAccessToken, commentValidation, validate, createComment);
router.delete('/:id', verifyAccessToken, deleteComment);
export default router;