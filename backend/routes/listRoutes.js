import express from 'express';
import {
  createList,
  getAllLists,
  getListById,
  updateList,
  deleteList,
  addQuestionToList,
  removeQuestionFromList
} from '../controllers/listController.js';

const router = express.Router();

// Standard CRUD routes
router.route('/')
  .post(createList)
  .get(getAllLists);

router.route('/:id')
  .get(getListById)
  .put(updateList)
  .delete(deleteList);

// Add/Remove questions from a specific list
router.route('/:id/questions')
  .post(addQuestionToList);

router.route('/:id/questions/:questionId')
  .delete(removeQuestionFromList);

export default router;