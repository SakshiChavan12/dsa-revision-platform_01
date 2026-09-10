
import express from 'express';
import { runCode, submitCode } from '../controllers/submissionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/run', runCode);
router.post('/submit', submitCode);

export default router;