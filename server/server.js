require('dotenv').config(); // trigger restart
const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./config/db');
const socketHandler = require('./utils/socketHandler');

// Routes
const authRoutes = require('./routes/auth.routes');
const noticeRoutes = require('./routes/notice.routes');
const userRoutes = require('./routes/user.routes');
const notificationRoutes = require('./routes/notification.routes');
const bookmarkRoutes = require('./routes/bookmark.routes');
const classroomRoutes = require('./routes/classroom.routes');
const assignmentRoutes = require('./routes/assignment.routes');

const app = express();
const server = http.createServer(app);

// Connect to Database
const User = require('./models/User');
connectDB().then(async () => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      await User.create({
        name: 'Admin User',
        email: 'admin@college.edu',
        password: 'password123',
        role: 'admin',
        branch: 'CS',
        year: 4
      });
      console.log('✅ Auto-Seeded default Admin User since none existed!');
    }
  } catch (err) {
    console.error('Error auto-seeding admin:', err);
  }
});

// Initialize Socket.io
socketHandler.init(server);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Adjust CORS
const allowedOrigins = [
  process.env.CLIENT_URL, 
  'http://localhost:5173', 
  'http://127.0.0.1:5173'
].filter(Boolean);

app.use(cors({ 
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('CORS connection blocked'));
    }
  }, 
  credentials: true 
}));
app.use(helmet());
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Static folder for local uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/classrooms', classroomRoutes);
app.use('/api/assignments', assignmentRoutes);

// Base route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'Resource not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
