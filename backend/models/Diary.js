import mongoose from 'mongoose';

const diarySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Tiêu đề là bắt buộc'],
    trim: true,
    maxlength: [200, 'Tiêu đề không được vượt quá 200 ký tự'],
  },
  content: {
    type: String,
    required: [true, 'Nội dung là bắt buộc'],
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
      message: 'Không được có quá 20 thẻ (tags)'
    }
  },
  coverPhoto: {
    type: String,
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
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  likesCount: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });


diarySchema.index({ userId: 1, createdAt: -1 });
diarySchema.index({ isPublic: 1, createdAt: -1 });
diarySchema.index({ tags: 1 });
diarySchema.index({ isDraft: 1, userId: 1 });
diarySchema.index({ likesCount: -1 });

const Diary = mongoose.model('Diary', diarySchema);

export default Diary;