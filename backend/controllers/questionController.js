import Question from '../models/Question.js';

// @desc    Get all questions
// @route   GET /api/questions
export const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find({}).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: questions.length,
      questions
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get single question by ID
// @route   GET /api/questions/:id
export const getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    res.status(200).json({ success: true, question });
  } catch (error) {
    console.error(error);
    // Handle invalid MongoDB ID format errors (e.g., ID is too short)
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Create a new question
// @route   POST /api/questions (Protected)
export const createQuestion = async (req, res) => {
  try {
    // req.user is automatically attached by the authMiddleware we wrote in Stage 3
    // We don't need to use req.user here, but it proves the user is logged in.

    const question = await Question.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Question created successfully',
      question
    });
  } catch (error) {
    console.error(error);
    // Handle Mongoose validation errors (e.g., missing required fields)
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Update a question
// @route   PUT /api/questions/:id (Protected)
export const updateQuestion = async (req, res) => {
  try {
    let question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    // Find and update. { new: true } returns the updated document.
    question = await Question.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Question updated successfully',
      question
    });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Delete a question
// @route   DELETE /api/questions/:id (Protected)
export const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    await question.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Question deleted successfully'
    });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};