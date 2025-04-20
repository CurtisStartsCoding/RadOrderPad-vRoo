import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import config from './config/config.js';
import routes from './routes/index.js';
import { testDatabaseConnections, closeDatabaseConnections } from './config/db.js';

// Create Express app
const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS

// Parse JSON bodies for all routes EXCEPT the Stripe webhook route
// This is important because Stripe webhooks need the raw body for signature verification
app.use((req, res, next) => {
  if (req.originalUrl === '/api/webhooks/stripe') {
    next();
  } else {
    express.json()(req, res, next);
  }
});

app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// API routes
app.use('/api', routes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

// Handle 404 routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start the server
const PORT = config.port;

const server = app.listen(PORT, async () => {
  console.log(`Server running in ${config.nodeEnv} mode on port ${PORT}`);
  
  // Test database connections
  try {
    const connectionsSuccessful = await testDatabaseConnections();
    if (!connectionsSuccessful) {
      console.warn('Database connection test failed. Server will continue running, but some features may not work properly.');
      // Don't shut down the server, just log a warning
      // await shutdownServer();
    }
  } catch (error) {
    console.error('Error testing database connections:', error);
    console.warn('Server will continue running, but some features may not work properly.');
    // Don't shut down the server, just log a warning
    // await shutdownServer();
  }
});

// Handle graceful shutdown
process.on('SIGTERM', shutdownServer);
process.on('SIGINT', shutdownServer);

async function shutdownServer() {
  console.log('Shutting down server...');
  
  // Close database connections
  await closeDatabaseConnections();
  
  // Close server
  server.close(() => {
    console.log('Server shut down successfully');
    process.exit(0);
  });
  
  // Force close after 5 seconds if graceful shutdown fails
  setTimeout(() => {
    console.error('Forced shutdown after timeout');
    process.exit(1);
  }, 5000);
}

export default app;