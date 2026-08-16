import express from 'express';
import {
  getAllQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion
} from '../controllers/questionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public Routes (Anyone can view questions)
router.route('/').get(getAllQuestions);
router.route('/:id').get(getQuestionById);

// Protected Routes (Only logged-in users can create/edit/delete)
router.route('/').post(protect, createQuestion);
router.route('/:id').put(protect, updateQuestion);
router.route('/:id').delete(protect, deleteQuestion);

export default router;