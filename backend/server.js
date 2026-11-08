
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';

const app = express();

// ==========================================
// CORS CONFIGURATION - LOCAL DEVELOPMENT
// ==========================================

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header (e.g. Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.error('Blocked CORS origin:', origin);
      return callback(new Error('Origin not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ==========================================
// BODY PARSING
// ==========================================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================================
// HEALTH CHECK
// ==========================================

app.get('/api/health', async (req, res) => {
  try {
    await connectDB();

    return res.status(200).json({
      success: true,
      message: 'SkillMatrix API is healthy',
      database: 'Connected',
      time: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Health check error:', error.message);

    return res.status(503).json({
      success: false,
      message: 'Database connection failed',
      error: error.message,
    });
  }
});

// ==========================================
// DATABASE MIDDLEWARE
// ==========================================

app.use('/api', async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('MongoDB connection error:', error.message);

    return res.status(503).json({
      success: false,
      message: 'Database connection failed. Please try again later.',
    });
  }
});

// ==========================================
// AUTHENTICATION ROUTES
// ==========================================

app.use('/api/auth', authRoutes);

// ==========================================
// EMPLOYEE ROUTES
// ==========================================

app.get('/api/employees', (req, res) => {
  return res.status(200).json({
    success: true,
    data: [
      {
        id: 'EMP-1024',
        name: 'Ananya Sen',
        role: 'Frontend Engineer',
        department: 'Engineering',
        skills: [{ name: 'React', score: 92 }],
      },
    ],
  });
});

// ==========================================
// PROJECT ROUTES
// ==========================================

app.get('/api/projects', (req, res) => {
  return res.status(200).json({
    success: true,
    data: [
      {
        name: 'SkillMatrix',
        status: 'On Track',
        members: 12,
      },
    ],
  });
});

// ==========================================
// 404 HANDLER
// ==========================================

app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ==========================================
// GLOBAL ERROR HANDLER
// ==========================================

app.use((err, req, res, next) => {
  console.error('Server error:', err.message);

  if (res.headersSent) {
    return next(err);
  }

  const isCorsError = err.message === 'Origin not allowed by CORS';

  return res.status(isCorsError ? 403 : 500).json({
    success: false,
    message: isCorsError ? 'Origin not allowed' : 'Internal server error',
  });
});

// ==========================================
// START LOCAL SERVER
// ==========================================

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log('================================');
      console.log('SkillMatrix Backend Started');
      console.log(`Server: http://localhost:${PORT}`);
      console.log(`Health: http://localhost:${PORT}/api/health`);
      console.log('MongoDB: Connected');
      console.log('================================');
    });
  } catch (error) {
    console.error('Failed to start SkillMatrix backend:', error.message);
    process.exit(1);
  }
};

startServer();
