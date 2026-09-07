import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import questionRoutes from './routes/questionRoutes.js';
import listRoutes from './routes/listRoutes.js';
import progressRoutes from './routes/progressRoutes.js';
import submissionRoutes from './routes/submissionRoutes.js';

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/lists', listRoutes);
app.use('/api/practice', progressRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/progress', progressRoutes);


// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'DSA Trainer API is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 DSA Trainer API running on port ${PORT}`);
});