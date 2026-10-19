// backend/routes/progressRoutes.js
import express from 'express';
import { 
  recordPracticeAttempt, 
  getProgress, 
  getDashboardData, 
  getStreak // <-- Add this here
} from '../controllers/progressController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/attempt', recordPracticeAttempt);
router.get('/', getProgress);
router.get('/dashboard', getDashboardData);
router.get('/streak', getStreak); // <-- Make sure this is here

export default router;