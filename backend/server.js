import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/database.js';
import authRoutes from './routes/auth.js';
import diaryRoutes from './routes/diary.js';
import commentRoutes from './routes/comment.js';
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
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/diary', diaryRoutes);
app.use('/api/comment', commentRoutes);
// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!', 
    error: process.env.NODE_ENV === 'development' ? err.message : undefined 
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
