import express from 'express';
import { body } from 'express-validator';
import {
  getUserDiaries,
  getPublicDiaries,
  getDiaryById,
  createDiary,
  updateDiary,
  deleteDiary,
  getDiariesByTag,
  getDiariesByMood,
  getUserDrafts,
  publishDraft,
  getUserRecentDiaries,
  toggleLike,
  likeDiary,
  unlikeDiary,
  getDashboardData,
  getPublicDiaryById,
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
router.get('/public', getPublicDiaries);
router.get('/public/:id', getPublicDiaryById);
router.get('/tag/:tag', getDiariesByTag);
router.get('/drafts', verifyAccessToken, getUserDrafts);
// Protected routes
router.get('/', verifyAccessToken, getUserDiaries);
router.get('/recent', verifyAccessToken, getUserRecentDiaries);
router.get('/dashboard', verifyAccessToken, getDashboardData);
router.get('/mood/:mood', verifyAccessToken, getDiariesByMood);
router.post('/', verifyAccessToken, diaryValidation, validate, createDiary);
router.get('/:id', verifyAccessToken, getDiaryById);
router.put('/:id', verifyAccessToken, updateDiaryValidation, validate, updateDiary);
router.delete('/:id', verifyAccessToken, deleteDiary);
router.patch('/:id/publish', verifyAccessToken, publishDraft);  


router.post('/:id/like', verifyAccessToken, toggleLike);
router.post('/:id/like/add', verifyAccessToken, likeDiary);
router.delete('/:id/like', verifyAccessToken, unlikeDiary);

export default router;