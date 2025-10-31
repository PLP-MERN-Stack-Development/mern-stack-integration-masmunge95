// server.js - Main server file for the MERN blog application

// Import required modules
const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const { ClerkExpressRequireAuth, ClerkExpressWithAuth } = require('@clerk/clerk-sdk-node');

// Load environment variables
dotenv.config();

// Import routes
const postRoutes = require('./routes/postRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const webhookRoutes = require('./routes/webhookRoutes');

// Connect to database
connectDB();
// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// Configure CORS to explicitly allow the frontend origins used in development and production.
// Use the ALLOWED_ORIGINS env var (comma-separated) or sensible defaults.
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173,https://mern-blog-manager.netlify.app').split(',').map(s => s.trim());
console.log('Allowed CORS origins:', allowedOrigins);

const corsOptions = {
  origin: (origin, callback) => {
    // allow requests with no origin (e.g., mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf('*') !== -1 || allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
};

// Webhook route needs to be before express.json()
app.use('/api/webhooks', webhookRoutes);

// Apply CORS middleware before any other routes to handle preflight requests
// and add CORS headers to all responses.
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Log requests in development mode
app.use(logger);

// Define routers for public and private (authenticated) API routes
const publicApiRouter = express.Router();
const privateApiRouter = express.Router();

// Apply Clerk authentication ONLY to the private router
privateApiRouter.use(ClerkExpressRequireAuth());

// Assign routes to the appropriate router
publicApiRouter.use('/posts', postRoutes.public); // Public post routes (GET all, GET one)
privateApiRouter.use('/posts', postRoutes.private); // Private post routes (CRUD)
publicApiRouter.use('/categories', categoryRoutes.public); // Public category routes (GET all)
privateApiRouter.use('/categories', categoryRoutes.private); // Private category routes (CRUD)

app.use('/api', publicApiRouter);
app.use('/api', privateApiRouter);

// Root route
app.get('/', (req, res) => {
  res.send('MERN Blog API is running');
});

// Error handling middleware
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  server.close(() => process.exit(1));
});

module.exports = app; 