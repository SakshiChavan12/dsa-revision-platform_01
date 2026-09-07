import express from 'express';
import { recordPracticeAttempt, getProgress } from '../controllers/progressController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protect all routes
router.use(protect);

// Record a practice attempt
router.post('/attempt', recordPracticeAttempt);

// Get user's progress
router.get('/', getProgress);

export default router;