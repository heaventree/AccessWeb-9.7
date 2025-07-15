import express from 'express';
import cors from 'cors';
import wcagTestRouter from './routes/wcag-test.js';
import { getAllPricingPlans, getPricingPlan } from '../api/pricing-plans.js';

const app = express();
const PORT = 3001;

// Trust proxy for rate limiting
app.set('trust proxy', 1);

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5000', 'http://localhost:3001'],
  credentials: true
}));

// Parse JSON
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// WCAG test routes
app.use('/api/wcag-test', wcagTestRouter);

// Pricing plans routes
app.get('/api/pricing-plans', getAllPricingPlans);
app.get('/api/pricing-plans/:id', getPricingPlan);

// Error handling
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ 
    message: 'Internal server error', 
    error: process.env.NODE_ENV === 'development' ? error.message : 'Server error' 
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`WCAG API Server running on port ${PORT}`);
});