import List from '../models/List.js';
import Question from '../models/Question.js';
import mongoose from 'mongoose';

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// @desc    Create a new list
// @route   POST /api/lists
export const createList = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Please provide a list name' });
    }

    const list = await List.create({
      name,
      description,
      user: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'List created successfully',
      list
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get all lists for the logged-in user
// @route   GET /api/lists
export const getAllLists = async (req, res) => {
  try {
    const lists = await List.find({ user: req.user.id }).sort({ createdAt: -1 });

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

// @desc    Get single list by ID
// @route   GET /api/lists/:id
export const getListById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid list ID format' });
    }

    const list = await List.findOne({ _id: id, user: req.user.id }).populate('questions');

    if (!list) {
      return res.status(404).json({ success: false, message: 'List not found' });
    }

    res.status(200).json({ success: true, list });
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

    let list = await List.findOne({ _id: id, user: req.user.id });

    if (!list) {
      return res.status(404).json({ success: false, message: 'List not found' });
    }

    list = await List.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, message: 'List updated successfully', list });
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

    const list = await List.findOne({ _id: id, user: req.user.id });

    if (!list) {
      return res.status(404).json({ success: false, message: 'List not found' });
    }

    await list.deleteOne();

    res.status(200).json({ success: true, message: 'List deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Add a SINGLE question to a list
// @route   POST /api/lists/:listId/questions/:questionId
export const addQuestionToList = async (req, res) => {
  try {
    const { listId, questionId } = req.params;

    if (!isValidId(listId) || !isValidId(questionId)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }

    const list = await List.findOne({ _id: listId, user: req.user.id });
    if (!list) {
      return res.status(404).json({ success: false, message: 'List not found' });
    }

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    // Check if question is already in the list
    if (list.questions.includes(questionId)) {
      return res.status(400).json({ success: false, message: 'Question already exists in this list' });
    }

    list.questions.push(questionId);
    await list.save();

    const updatedList = await List.findById(listId).populate('questions');

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

// @desc    Add MULTIPLE questions to a list (Bulk Add)
// @route   PATCH /api/lists/:listId/questions
export const addMultipleQuestionsToList = async (req, res) => {
  try {
    const { listId } = req.params;
    const { questionIds } = req.body;

    if (!isValidId(listId)) {
      return res.status(400).json({ success: false, message: 'Invalid list ID format' });
    }

    if (!Array.isArray(questionIds) || questionIds.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide an array of questionIds' });
    }

    // Remove duplicate IDs from the incoming request
    const uniqueQuestionIds = [...new Set(questionIds)];

    for (const id of uniqueQuestionIds) {
      if (!isValidId(id)) {
        return res.status(400).json({ success: false, message: `Invalid question ID format: ${id}` });
      }
    }

    const list = await List.findOne({ _id: listId, user: req.user.id });
    if (!list) {
      return res.status(404).json({ success: false, message: 'List not found' });
    }

    // Determine existing IDs in the list
    const existingQuestionIds = list.questions.map(id => id.toString());
    const newQuestionIds = uniqueQuestionIds.filter(id => !existingQuestionIds.includes(id));
    const skippedQuestionIds = uniqueQuestionIds.filter(id => existingQuestionIds.includes(id));

    if (newQuestionIds.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'All selected questions are already in this list',
        addedCount: 0,
        skippedCount: skippedQuestionIds.length,
        addedQuestionIds: [],
        skippedQuestionIds
      });
    }

    // Verify new questions exist in Question collection
    const foundQuestions = await Question.find({ _id: { $in: newQuestionIds } });
    const foundQuestionIds = foundQuestions.map(q => q._id.toString());
    const trulyNewQuestionIds = newQuestionIds.filter(id => foundQuestionIds.includes(id));
    const missingQuestionIds = newQuestionIds.filter(id => !foundQuestionIds.includes(id));

    if (trulyNewQuestionIds.length > 0) {
      await List.findByIdAndUpdate(
        listId,
        { $addToSet: { questions: { $each: trulyNewQuestionIds } } },
        { new: true }
      );
    }

    const updatedList = await List.findById(listId).populate('questions');

    const totalSkipped = skippedQuestionIds.length + missingQuestionIds.length;

    res.status(200).json({
      success: true,
      message: 'Questions added successfully',
      addedCount: trulyNewQuestionIds.length,
      skippedCount: totalSkipped,
      addedQuestionIds: trulyNewQuestionIds,
      skippedQuestionIds: [...skippedQuestionIds, ...missingQuestionIds],
      list: updatedList
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Remove a question from a list
// @route   DELETE /api/lists/:listId/questions/:questionId
export const removeQuestionFromList = async (req, res) => {
  try {
    const { listId, questionId } = req.params;

    if (!isValidId(listId) || !isValidId(questionId)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }

    const list = await List.findOne({ _id: listId, user: req.user.id });
    if (!list) {
      return res.status(404).json({ success: false, message: 'List not found' });
    }

    list.questions.pull(questionId);
    await list.save();

    const updatedList = await List.findById(listId).populate('questions');

    res.status(200).json({ success: true, message: 'Question removed from list successfully', list: updatedList });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


// @desc    Get a random question from a specific list
// @route   GET /api/lists/:listId/random-question
// @desc    Get a random question from a specific list (only executable ones)
// @route   GET /api/lists/:listId/random-question
export const getRandomQuestionFromList = async (req, res) => {
  try {
    const { listId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(listId)) {
      return res.status(400).json({ success: false, message: 'Invalid list ID format' });
    }

    // ─── Only return questions that the driver can actually execute ───
    const SUPPORTED_PARSERS = [
      'array',
      'arrayTarget',
      'arrayK',
      'string',
      'twoStrings',
      'stringArray',
      'number',
      'twoArrays',
      'matrixTarget',
      'linkedList',
      'linkedListN',
      'twoLinkedLists',
      'tree',
      'treeTwoNodes',
      'intervalArray',
      'intervalArrayPlus'
    ];

    const list = await List.findOne({ _id: listId, user: req.user.id })
      .populate({
        path: 'questions',
        match: {
          functionName: { $exists: true, $ne: '' },
          inputParser: { $in: SUPPORTED_PARSERS },
          'testCases.0': { $exists: true } // at least one test case
        }
      });

    if (!list) {
      return res.status(404).json({ success: false, message: 'List not found' });
    }

    if (!list.questions || list.questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'This list has no executable questions. Try another list.'
      });
    }

    // Pick a random question
    const randomIndex = Math.floor(Math.random() * list.questions.length);
    const randomQuestion = list.questions[randomIndex];

    res.status(200).json({
      success: true,
      question: randomQuestion
    });
  } catch (error) {
    console.error('getRandomQuestionFromList error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};