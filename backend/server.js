import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';

const app = express();

const configuredOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = new Set([
  'http://localhost:5173',
  'http://localhost:5174',
  'https://skill-matrix-frontend-seven.vercel.app',
  'https://skill-matrix-frontend-ipyy464fe-parna-das-projects-8f9a10f4.vercel.app',
  'https://skill-matrix-frontend-5z8hdmlxy-parna-das-projects-8f9a10f4.vercel.app',
  ...configuredOrigins,
]);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.has(origin)) {
      return callback(null, true);
    }

    console.error('Blocked CORS origin:', origin);
    return callback(new Error('Origin not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

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
    });
  }
});

app.use('/api', async (req, res, next) => {
  try {
    await connectDB();
    return next();
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    return res.status(503).json({
      success: false,
      message: 'Database connection failed. Please try again later.',
    });
  }
});

app.use('/api/auth', authRoutes);

app.get('/api/employees', (req, res) => {
  return res.status(200).json({
    success: true,
    data: [{
      id: 'EMP-1024',
      name: 'Ananya Sen',
      role: 'Frontend Engineer',
      department: 'Engineering',
      skills: [{ name: 'React', score: 92 }],
    }],
  });
});

app.get('/api/projects', (req, res) => {
  return res.status(200).json({
    success: true,
    data: [{
      name: 'SkillMatrix',
      status: 'On Track',
      members: 12,
    }],
  });
});

app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

app.use((err, req, res, next) => {
  console.error('Server error:', err.message);

  if (res.headersSent) return next(err);

  const isCorsError = err.message === 'Origin not allowed by CORS';
  return res.status(isCorsError ? 403 : 500).json({
    success: false,
    message: isCorsError ? 'Origin not allowed' : 'Internal server error',
  });
});

// Vercel imports the Express app; local development starts a listener.
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;

  connectDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`SkillMatrix backend running on http://localhost:${PORT}`);
      });
    })
    .catch((error) => {
      console.error('Failed to start SkillMatrix backend:', error.message);
      process.exitCode = 1;
    });
}

export default app;
