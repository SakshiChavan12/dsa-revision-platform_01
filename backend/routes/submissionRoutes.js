// import express from 'express';
// import { protect } from '../middleware/authMiddleware.js';
// import Submission from '../models/Submission.js';
// import Question from '../models/Question.js';

// const router = express.Router();

// router.use(protect);

// // Mock Submission - Saves to MongoDB. Always accepts for testing
// router.post('/', async (req, res) => {
//   try {
//     const { questionId, listId, code, language } = req.body;

//     if (!questionId || !code || !language) {
//       return res.status(400).json({ success: false, message: 'Missing required fields' });
//     }

//     // Check if question exists
//     const question = await Question.findById(questionId);
//     if (!question) {
//       return res.status(404).json({ success: false, message: 'Question not found' });
//     }

//     // Save submission
//     const submission = await Submission.create({
//       user: req.user.id,
//       question: questionId,
//       list: listId,
//       code,
//       language,
//       status: 'Accepted', // Mock status
//       isCorrect: true,    // Mock result
//     });

//     res.status(201).json({
//       success: true,
//       submission: {
//         id: submission._id,
//         status: 'Accepted',
//         isCorrect: true
//       }
//     });
//   } catch (error) {
//     console.error('Error saving submission:', error.message);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// export default router;

import express from 'express';
import { runCode, submitCode } from '../controllers/submissionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/run', runCode);
router.post('/submit', submitCode);

export default router;