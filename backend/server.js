import "./dns.js";

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js'; // <-- NEW
import questionRoutes from './routes/questionRoutes.js';
import listRoutes from './routes/listRoutes.js';

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cors());
app.use('/api/lists', listRoutes); 
app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes); // <-- NEW LINE

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'DSA Trainer API is running'
  });
});

// Mount the authentication routes
app.use('/api/auth', authRoutes); // <-- NEW

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 DSA Trainer API running on port ${PORT}`);
});

