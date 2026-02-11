import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: function () {
      // Password is only required for local authentication
      return this.provider === 'local';
    },
    minlength: [6, 'Password must be at least 6 characters'],
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true, // Allows multiple null values
  },
  provider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local',
  },
  bio: {
    type: String,
    maxlength: [160, 'Bio must not exceed 160 characters'],
    default: '',
  },
  profileImage: {
    type: String, // Base64 string or URL
    default: null,
  },
  urls: [{
    value: {
      type: String,
      match: [/^https?:\/\/.+/, 'Please provide a valid URL'],
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
// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  // If user doesn't have a password (OAuth user), return false
  if (!this.password) {
    return false;
  }
  return await bcrypt.compare(candidatePassword, this.password);
};
const User = mongoose.model('User', userSchema);
export default User;