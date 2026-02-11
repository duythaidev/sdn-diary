import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import connectDB from './config/database.js';
import authRoutes from './routes/auth.js';
import diaryRoutes from './routes/diary.js';
import commentRoutes from './routes/comment.js';
import morgan from 'morgan';
import passport from './config/passport.js';
dotenv.config();
// Load environment variables
// Initialize Express app
const app = express();
// Connect to MongoDB
connectDB();
// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Session configuration for Passport
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

app.use(morgan('combined'));
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/diary', diaryRoutes);
app.use('/api/comment', commentRoutes);
// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});
// Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ 
//     message: 'Something went wrong!', 
//     error: process.env.NODE_ENV === 'development' ? err.message : undefined 
//   });
// });

app.use((err, req, res, next) => {
  console.error("🔥 ERROR:", err.message);
  console.error(err.stack);

  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
