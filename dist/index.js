"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const config_js_1 = __importDefault(require("./config/config.js"));
const index_js_1 = __importDefault(require("./routes/index.js"));
const db_js_1 = require("./config/db.js");
// Create Express app
const app = (0, express_1.default)();
// Middleware
app.use((0, helmet_1.default)()); // Security headers
app.use((0, cors_1.default)()); // Enable CORS
// Parse JSON bodies for all routes EXCEPT the Stripe webhook route
// This is important because Stripe webhooks need the raw body for signature verification
app.use((req, res, next) => {
    if (req.originalUrl === '/api/webhooks/stripe') {
        next();
    }
    else {
        express_1.default.json()(req, res, next);
    }
});
app.use(express_1.default.urlencoded({ extended: true })); // Parse URL-encoded bodies
// API routes
app.use('/api', index_js_1.default);
// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ message: 'Internal server error' });
});
// Handle 404 routes
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});
// Start the server
const PORT = config_js_1.default.port;
const server = app.listen(PORT, async () => {
    console.log(`Server running in ${config_js_1.default.nodeEnv} mode on port ${PORT}`);
    // Test database connections
    try {
        const connectionsSuccessful = await (0, db_js_1.testDatabaseConnections)();
        if (!connectionsSuccessful) {
            console.warn('Database connection test failed. Server will continue running, but some features may not work properly.');
            // Don't shut down the server, just log a warning
            // await shutdownServer();
        }
    }
    catch (error) {
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
    await (0, db_js_1.closeDatabaseConnections)();
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
exports.default = app;
//# sourceMappingURL=index.js.map