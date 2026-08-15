import express from 'express';
import { registerUser, loginUser, getCurrentUser } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public Route
router.post('/register', registerUser);

// Public Route
router.post('/login', loginUser);

// Protected Route - add 'protect' middleware before the controller
router.get('/me', protect, getCurrentUser);

export default router;