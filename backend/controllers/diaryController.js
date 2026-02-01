import Diary from '../models/Diary.js';
import Comment from '../models/Comment.js';
// Get user's diaries
export const getUserDiaries = async (req, res) => {
  try {
    const diaries = await Diary.find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .populate('userId', 'username email');
    res.json({ diaries });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// Get all public diaries
export const getPublicDiaries = async (req, res) => {
  try {
    const diaries = await Diary.find({ isPublic: true })
      .sort({ createdAt: -1 })
      .populate('userId', 'username email');
    res.json({ diaries });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// Get single diary by ID
export const getDiaryById = async (req, res) => {
  try {
    const { id } = req.params;
    const diary = await Diary.findById(id).populate('userId', 'username email');
    if (!diary) {
      return res.status(404).json({ message: 'Diary not found' });
    }
    // Check if diary is private and user is not the owner
    if (!diary.isPublic && diary.userId._id.toString() !== req.user?.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    // Get comments for this diary
    const comments = await Comment.find({ diaryId: id })
      .sort({ createdAt: -1 })
      .populate('userId', 'username email');
    res.json({ diary, comments });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// Create new diary
export const createDiary = async (req, res) => {
  try {
    const { title, content, isPublic } = req.body;
    const diary = new Diary({
      title,
      content,
      isPublic: isPublic || false,
      userId: req.user.userId,
    });
    await diary.save();
    await diary.populate('userId', 'username email');
    res.status(201).json({ 
      message: 'Diary created successfully', 
      diary 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// Update diary
export const updateDiary = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, isPublic } = req.body;
    const diary = await Diary.findById(id);
    if (!diary) {
      return res.status(404).json({ message: 'Diary not found' });
    }
    // Check if user is the owner
    if (diary.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to update this diary' });
    }
    // Update fields
    if (title !== undefined) diary.title = title;
    if (content !== undefined) diary.content = content;
    if (isPublic !== undefined) diary.isPublic = isPublic;
    diary.updatedAt = Date.now();
    await diary.save();
    await diary.populate('userId', 'username email');
    res.json({ 
      message: 'Diary updated successfully', 
      diary 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// Delete diary
export const deleteDiary = async (req, res) => {
  try {
    const { id } = req.params;
    const diary = await Diary.findById(id);
    if (!diary) {
      return res.status(404).json({ message: 'Diary not found' });
    }
    // Check if user is the owner
    if (diary.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this diary' });
    }
    // Delete all comments associated with this diary
    await Comment.deleteMany({ diaryId: id });
    // Delete diary
    await Diary.findByIdAndDelete(id);
    res.json({ message: 'Diary deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
