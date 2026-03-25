require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

const app = express();

// Middleware
const frontendUrls = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',') : ['http://localhost:5173'];
const allowedOrigins = frontendUrls.map(url => url.replace(/\/$/, '').trim());

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    const normalizedOrigin = origin.replace(/\/$/, '').trim();
    if (allowedOrigins.includes(normalizedOrigin)) {
      return callback(null, true);
    } else {
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
      return callback(new Error(msg), false);
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Connect to Database
connectDB();

// Basic Route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API is running' });
});

// Routes placeholders
app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/resumes', require('./routes/resumeRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/analyze', require('./routes/analyzerRoutes'));
app.use('/api/export', require('./routes/exportRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
