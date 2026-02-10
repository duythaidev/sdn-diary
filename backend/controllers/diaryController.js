import Diary from '../models/Diary.js';
import Comment from '../models/Comment.js';

const MAX_COVER_PHOTO_SIZE = 5 * 1024 * 1024;
const MAX_DIARIES_PER_PAGE = 10;
const RECENT_DIARIES_LIMIT = 3;

export const getUserDiaries = async (req, res) => {
  try {
    const { dateFilter, moodFilter, tagsFilter } = req.query;
    const query = { userId: req.user.userId };

    // Date filter
    if (dateFilter === 'today') {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      query.createdAt = { $gte: startOfDay };
    } else if (dateFilter === 'this_week') {
      const startOfWeek = new Date();
      const day = startOfWeek.getDay();
      const diff = day === 0 ? -6 : 1 - day;
      startOfWeek.setDate(startOfWeek.getDate() + diff);
      startOfWeek.setHours(0, 0, 0, 0);
      query.createdAt = { $gte: startOfWeek };
    } else if (dateFilter === 'this_month') {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      query.createdAt = { $gte: startOfMonth };
    }

    // Mood filter
    if (moodFilter && moodFilter !== 'all') {
      query.selectedMood = moodFilter;
    }

    // Tags filter
    if (tagsFilter && tagsFilter !== 'all') {
      query.tags = { $in: [tagsFilter] };
    }

    const diaries = await Diary.find(query)
      .sort({ createdAt: -1 })
      .populate('userId', 'username email');
    res.json({ diaries });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getUserRecentDiaries = async (req, res) => {
  try {
    const diaries = await Diary.find({ userId: req.user.userId })
      .sort({ updatedAt: -1 })
      .limit(RECENT_DIARIES_LIMIT)
      .populate('userId', 'username email');
    res.json({ diaries });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getUserPublishedDiaries = async (req, res) => {
  try {
    const diaries = await Diary.find({
      userId: req.user.userId,
      isDraft: false
    })
      .sort({ createdAt: -1 })
      .populate('userId', 'username email');
    res.json({ diaries });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getUserDrafts = async (req, res) => {
  try {
    const diaries = await Diary.find({
      userId: req.user.userId,
      isDraft: true
    })
      .sort({ updatedAt: -1 })
      .populate('userId', 'username email');
    res.json({ diaries });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getPublicDiaries = async (req, res) => {
  try {
    const diaries = await Diary.find({
      isPublic: true,
      isDraft: false
    })
      .sort({ createdAt: -1 })
      .populate('userId', 'username email');
    res.json({ diaries });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getDiaryById = async (req, res) => {
  try {
    const { id } = req.params;
    const diary = await Diary.findById(id).populate('userId', 'username email');

    if (!diary) {
      return res.status(404).json({ message: 'Diary not found' });
    }

    if ((!diary.isPublic || diary.isDraft) && diary.userId._id.toString() !== req.user?.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    let comments = [];
    if (diary.allowComments && !diary.isDraft) {
      comments = await Comment.find({ diaryId: id })
        .sort({ createdAt: -1 })
        .populate('userId', 'username email');
    }

    res.json({ diary, comments });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const createDiary = async (req, res) => {
  try {
    const {
      title,
      content,
      isPublic,
      allowComments,
      selectedMood,
      tags,
      coverPhoto,
      isDraft
    } = req.body;

    if (coverPhoto && coverPhoto.length > MAX_COVER_PHOTO_SIZE) {
      return res.status(400).json({ message: 'Cover photo is too large. Maximum size is 5MB.' });
    }

    const diary = new Diary({
      title,
      content,
      isPublic: isPublic || false,
      allowComments: allowComments !== undefined ? allowComments : true,
      selectedMood: selectedMood || 'happy',
      tags: tags || [],
      coverPhoto: coverPhoto || null,
      isDraft: isDraft || false,
      userId: req.user.userId,
    });

    await diary.save();
    await diary.populate('userId', 'username email');

    res.status(201).json({
      message: isDraft ? 'Draft saved successfully' : 'Diary created successfully',
      diary
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation error',
        error: error.message
      });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateDiary = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      content,
      isPublic,
      allowComments,
      selectedMood,
      tags,
      coverPhoto,
      isDraft
    } = req.body;

    const diary = await Diary.findById(id);

    if (!diary) {
      return res.status(404).json({ message: 'Diary not found' });
    }

    if (diary.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to update this diary' });
    }
    if (coverPhoto && coverPhoto.length > MAX_COVER_PHOTO_SIZE) {
      return res.status(400).json({ message: 'Cover photo is too large. Maximum size is 5MB.' });
    }

    // Update fields
    if (title !== undefined) diary.title = title;
    if (content !== undefined) diary.content = content;
    if (isPublic !== undefined) diary.isPublic = isPublic;
    if (allowComments !== undefined) diary.allowComments = allowComments;
    if (selectedMood !== undefined) diary.selectedMood = selectedMood;
    if (tags !== undefined) diary.tags = tags;
    if (coverPhoto !== undefined) diary.coverPhoto = coverPhoto;
    if (isDraft !== undefined) diary.isDraft = isDraft;

    diary.updatedAt = Date.now();

    await diary.save();
    await diary.populate('userId', 'username email');

    res.json({
      message: isDraft ? 'Draft saved successfully' : 'Diary updated successfully',
      diary
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation error',
        error: error.message
      });
    }
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

    await diary.deleteOne();

    // Optionally delete all comments associated with this diary
    await Comment.deleteMany({ diaryId: id });

    res.json({ message: 'Diary deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get diaries by tag (exclude drafts)
export const getDiariesByTag = async (req, res) => {
  try {
    const { tag } = req.params;

    const diaries = await Diary.find({
      tags: tag.toLowerCase(),
      isPublic: true,
      isDraft: false
    })
      .sort({ createdAt: -1 })
      .populate('userId', 'username email');

    res.json({ diaries, tag });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getDiariesByMood = async (req, res) => {
  try {
    const { mood } = req.params;

    // Validate mood
    const validMoods = ['stressed', 'okay', 'calm', 'happy', 'great'];
    if (!validMoods.includes(mood)) {
      return res.status(400).json({ message: 'Invalid mood value' });
    }

    const diaries = await Diary.find({
      userId: req.user.userId,
      selectedMood: mood
    })
      .sort({ createdAt: -1 })
      .populate('userId', 'username email');

    res.json({ diaries, mood });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const publishDraft = async (req, res) => {
  try {
    const { id } = req.params;
    const diary = await Diary.findById(id);

    if (!diary) {
      return res.status(404).json({ message: 'Diary not found' });
    }

    if (diary.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to publish this diary' });
    }

    if (!diary.isDraft) {
      return res.status(400).json({ message: 'This diary is already published' });
    }

    diary.isDraft = false;
    diary.updatedAt = Date.now();

    await diary.save();
    await diary.populate('userId', 'username email');

    res.json({
      message: 'Diary published successfully',
      diary
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};