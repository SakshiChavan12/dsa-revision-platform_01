import express from 'express';
import {
  getQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion
} from '../controllers/questionController.js';

const router = express.Router();

// GET all questions, POST a new question
router.route('/')
  .get(getQuestions)
  .post(createQuestion);

// GET, PUT, DELETE a single question by ID
router.route('/:id')
  .get(getQuestionById)
  .put(updateQuestion)
  .delete(deleteQuestion);

export default router;