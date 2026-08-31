import express from 'express';
import {
  createList,
  getAllLists,
  getListById,
  updateList,
  deleteList,
  addQuestionToList,
  removeQuestionFromList,
  addMultipleQuestionsToList,
  getRandomQuestionFromList  // <--- THIS WAS MISSING!
} from '../controllers/listController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protect ALL list routes (must be logged in)
router.use(protect);

// Standard CRUD routes
router.route('/')
  .post(createList)
  .get(getAllLists);

router.route('/:id')
  .get(getListById)
  .put(updateList)
  .delete(deleteList);

// Add a SINGLE question to a specific list
router.route('/:listId/questions/:questionId')
  .post(addQuestionToList)
  .delete(removeQuestionFromList);

// Add MULTIPLE questions to a specific list (Bulk Add - NEW)
router.route('/:listId/questions')
  .patch(addMultipleQuestionsToList);

// Get a random question from a specific list (NEW)
router.route('/:listId/random-question')
  .get(getRandomQuestionFromList);

export default router;