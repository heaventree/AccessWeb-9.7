import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRouter from '../api/auth.js';
import { PrismaClient } from '@prisma/client';

// Create Prisma client
const prisma = new PrismaClient();

// Create Express app
const app = express();
const PORT = process.env.SERVER_PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-app-domain.com'] 
    : ['http://localhost:5000', 'http://localhost:3001', 'http://localhost:5001'],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Database connection test
app.get('/api/health', async (req, res) => {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ status: 'error', database: 'disconnected', error: String(error) });
  }
});

// API Routes
app.use('/api/auth', authRouter);

// Start server
app.listen(PORT, () => {
  console.log(`API Server running on port ${PORT}`);
});