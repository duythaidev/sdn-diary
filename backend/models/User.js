import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Tên người dùng là bắt buộc'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email là bắt buộc'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Vui lòng cung cấp email hợp lệ'],
  },
  password: {
    type: String,
    required: function () {
      return this.provider === 'local';
    },
    minlength: [6, 'Mật khẩu phải có ít nhất 6 ký tự'],
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },
  provider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local',
  },
  bio: {
    type: String,
    maxlength: [160, 'Tiểu sử không được vượt quá 160 ký tự'],
    default: '',
  },
  profileImage: {
    type: String,
    default: null,
  },
  urls: [{
    value: {
      type: String,
      match: [/^https?:\/\/.+/, 'Vui lòng cung cấp URL hợp lệ'],
    }
  }],
  resetPasswordToken: {
    type: String,
    default: null,
  },
  resetPasswordExpires: {
    type: Date,
    default: null,
  },
}, { timestamps: true });

userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) {
    return false;
  }
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;