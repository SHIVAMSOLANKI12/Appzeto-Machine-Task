import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Route imports
import adminRoutes from './routes/adminRoutes.js';
import authRoutes from './routes/authRoutes.js';
import movieRoutes from './routes/movieRoutes.js';
import showRoutes from './routes/showRoutes.js';
import seatRoutes from './routes/seatRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';

// Middleware imports
import { errorMiddleware, notFound } from './middlewares/errorMiddleware.js';

dotenv.config();

const app = express();

// Security and Logging Middlewares
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date()
  });
});

// API Routes
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/shows', showRoutes);
app.use('/api/seats', seatRoutes);
app.use('/api', bookingRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorMiddleware);

export default app;
