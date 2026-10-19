import express from 'express';
import { toggleBookmark, getBookmarks } from '../controllers/bookmarkController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getBookmarks);
router.post('/:questionId', toggleBookmark);

export default router;