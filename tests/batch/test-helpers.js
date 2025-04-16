/**
 * Test Helpers
 * 
 * This file contains helper functions for test scripts.
 */

const jwt = require('jsonwebtoken');
const config = require('./test-config');

/**
 * Generate a JWT token for a user
 * @param {Object} user - User object with userId, orgId, role, and email
 * @param {string} expiresIn - Token expiration time (default: '24h')
 * @returns {string} JWT token
 */
function generateToken(user, expiresIn = '24h') {
    const payload = {
        userId: user.userId,
        orgId: user.orgId,
        role: user.role,
        email: user.email
    };
    
    return jwt.sign(payload, config.api.jwtSecret, { expiresIn });
}

/**
 * Get database connection string for psql
 * @param {string} database - Database name ('main' or 'phi')
 * @returns {string} Connection string for psql command
 */
function getDbConnectionString(database) {
    const db = database === 'main' ? config.database.mainDb : config.database.phiDb;
    return `-U ${config.database.user} -d ${db}`;
}

/**
 * Get Docker exec command for database operations
 * @param {string} database - Database name ('main' or 'phi')
 * @param {string} sqlCommand - SQL command to execute
 * @returns {string} Full Docker exec command
 */
function getDockerDbCommand(database, sqlCommand) {
    const connectionString = getDbConnectionString(database);
    return `docker exec ${config.database.container} psql ${connectionString} -c "${sqlCommand}"`;
}

/**
 * Get API URL for a specific endpoint
 * @param {string} endpoint - API endpoint (without leading slash)
 * @returns {string} Full API URL
 */
function getApiUrl(endpoint) {
    return `${config.api.baseUrl}/${endpoint}`;
}

module.exports = {
    generateToken,
    getDbConnectionString,
    getDockerDbCommand,
    getApiUrl,
    config
};