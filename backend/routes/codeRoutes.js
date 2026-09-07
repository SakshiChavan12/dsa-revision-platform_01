// backend/routes/codeRoutes.js
import express from 'express';
import { testCode } from '../controllers/codeController.js';

const router = express.Router();

// Test route
router.post('/test', testCode);

export default router;