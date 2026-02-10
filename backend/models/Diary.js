import mongoose from 'mongoose';

const diarySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
  allowComments: {
    type: Boolean,
    default: true,
  },
  selectedMood: {
    type: String,
    enum: ['stressed', 'okay', 'calm', 'happy', 'great'],
    default: 'happy',
  },
  tags: {
    type: [String],
    default: [],
    validate: {
      validator: function (tags) {
        return tags.length <= 20;
      },
      message: 'Cannot have more than 20 tags'
    }
  },
  coverPhoto: {
    type: String, // Base64 string or URL
    default: null,
  },
  isDraft: {
    type: Boolean,
    default: false,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });


// Index for better query performance
diarySchema.index({ userId: 1, createdAt: -1 });
diarySchema.index({ isPublic: 1, createdAt: -1 });
diarySchema.index({ tags: 1 });
diarySchema.index({ isDraft: 1, userId: 1 });


const Diary = mongoose.model('Diary', diarySchema);

export default Diary;