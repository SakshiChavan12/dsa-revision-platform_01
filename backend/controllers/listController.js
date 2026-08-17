import List from '../models/List.js';
import Question from '../models/Question.js';
import mongoose from 'mongoose';

// Helper to validate MongoDB ObjectId
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// @desc    Create a new list
// @route   POST /api/lists
export const createList = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Please provide a list name' });
    }

    const list = await List.create({ name, description });

    res.status(201).json({
      success: true,
      list
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get all lists
// @route   GET /api/lists
export const getAllLists = async (req, res) => {
  try {
    const lists = await List.find({}).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: lists.length,
      lists
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get single list by ID (with populated questions)
// @route   GET /api/lists/:id
export const getListById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid list ID format' });
    }

    // .populate('questions') replaces the ObjectIds with the actual Question documents
    const list = await List.findById(id).populate('questions');

    if (!list) {
      return res.status(404).json({ success: false, message: 'List not found' });
    }

    res.status(200).json({
      success: true,
      list
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update a list
// @route   PUT /api/lists/:id
export const updateList = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid list ID format' });
    }

    let list = await List.findById(id);

    if (!list) {
      return res.status(404).json({ success: false, message: 'List not found' });
    }

    // Update only the fields sent in the body
    list = await List.findByIdAndUpdate(id, req.body, {
      new: true, // Return the updated document
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'List updated successfully',
      list
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Delete a list
// @route   DELETE /api/lists/:id
export const deleteList = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid list ID format' });
    }

    const list = await List.findById(id);

    if (!list) {
      return res.status(404).json({ success: false, message: 'List not found' });
    }

    await list.deleteOne();

    res.status(200).json({
      success: true,
      message: 'List deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Add a question to a list
// @route   POST /api/lists/:id/questions
export const addQuestionToList = async (req, res) => {
  try {
    const { id } = req.params;
    const { questionId } = req.body;

    if (!isValidId(id) || !isValidId(questionId)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }

    // 1. Check if the list exists
    const list = await List.findById(id);
    if (!list) {
      return res.status(404).json({ success: false, message: 'List not found' });
    }

    // 2. Check if the question exists in the Question collection
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    // 3. Check if the question is already in the list (to prevent duplicates)
    if (list.questions.includes(questionId)) {
      return res.status(400).json({ success: false, message: 'Question already exists in this list' });
    }

    // 4. Add the question ID to the array
    list.questions.push(questionId);
    await list.save();

    // 5. Return the updated list, populated with question details
    const updatedList = await List.findById(id).populate('questions');

    res.status(200).json({
      success: true,
      message: 'Question added to list successfully',
      list: updatedList
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Remove a question from a list
// @route   DELETE /api/lists/:id/questions/:questionId
export const removeQuestionFromList = async (req, res) => {
  try {
    const { id, questionId } = req.params;

    if (!isValidId(id) || !isValidId(questionId)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }

    const list = await List.findById(id);
    if (!list) {
      return res.status(404).json({ success: false, message: 'List not found' });
    }

    // Pull removes the questionId from the array
    list.questions.pull(questionId);
    await list.save();

    const updatedList = await List.findById(id).populate('questions');

    res.status(200).json({
      success: true,
      message: 'Question removed from list successfully',
      list: updatedList
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};