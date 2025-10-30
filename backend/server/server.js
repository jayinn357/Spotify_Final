import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Import routes
import authRoutes from './routes/auth.js';
import spotifyRoutes from './routes/spotify.js';
import trackRoutes from './routes/tracks.js';
import settingsRoutes from './routes/settings.js';
import crudRoutes from './routes/crud.js';

// Import database
import sequelize from './config/database.js';
// Initialize models & associations
import './models/index.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
  }
}));

// Serve static files from frontend/public
app.use('/audio', express.static(join(__dirname, '../../frontend/public/audio')));
app.use('/images', express.static(join(__dirname, '../../frontend/public/images')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/spotify', spotifyRoutes);
app.use('/api/tracks', trackRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/crud', crudRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Database connection and server start
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
    
    // Don't auto-sync when using existing Laravel database
    // Models will work with existing tables
    // await sequelize.sync({ alter: true });
    console.log('✅ Using existing database tables.');
    
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
      console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL}`);
    });
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ ===== UNHANDLED REJECTION =====');
  console.error('Promise:', promise);
  console.error('Reason:', reason);
  console.error('Stack:', reason?.stack);
  console.error('===================================');
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ ===== UNCAUGHT EXCEPTION =====');
  console.error('Error:', error);
  console.error('Stack:', error.stack);
  console.error('===================================');
  // Don't exit immediately - let us see the error
  setTimeout(() => process.exit(1), 1000);
});

startServer();

export default app;
