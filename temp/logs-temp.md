dist/services/organization/index.js

"use strict";

/**

 * Organization service module

 *

 * This module exports all organization-related services

 */

Object.defineProperty(exports, "__esModule", { value: true });

exports.searchOrganizations = exports.updateOrganizationProfile = exports.getMyOrganization = void 0;

// Export the get-my-organization service from the fixed implementation

const get_my_organization_fixed_js_1 = require("./get-my-organization-fixed.js");

Object.defineProperty(exports, "getMyOrganization", { enumerable: true, get: function () { return get_my_organization_fixed_js_1.getMyOrganization; } });

// Export the update-organization-profile service

const update_organization_profile_service_js_1 = require("./update-organization-profile.service.js");

Object.defineProperty(exports, "updateOrganizationProfile", { enumerable: true, get: function () { return update_organization_profile_service_js_1.updateOrganizationProfile; } });

// Export the search-organizations service

const search_organizations_service_js_1 = require("./search-organizations.service.js");

Object.defineProperty(exports, "searchOrganizations", { enumerable: true, get: function () { return search_organizations_service_js_1.searchOrganizations; } });

//# sourceMappingURL=index.js.map

dist/services/organization/get-my-organization.js

        // First check if the status column exists in the organizations table

        const checkStatusColumn = await (0, db_1.queryMainDb)(`SELECT column_name

       FROM information_schema.columns

       WHERE table_name = 'organizations' AND column_name = 'status'`);

        const statusColumnExists = checkStatusColumn.rows.length > 0;

        // Query the organizations table for the organization with the given ID

        // Dynamically build the query based on whether the status column exists

        const orgQuery = `SELECT

      id, name, type, npi, tax_id, address_line1, address_line2,

      city, state, zip_code, phone_number, fax_number, contact_email,

      website, logo_url, billing_id, credit_balance, subscription_tier,

      ${statusColumnExists ? 'status,' : ''} created_at, updated_at

     FROM organizations

     WHERE id = $1`;

        const orgResult = await (0, db_1.queryMainDb)(orgQuery, [orgId]);

        // If no organization is found, return null

        if (orgResult.rows.length === 0) {

            return null;

        }

        const organization = orgResult.rows[0];

        // If status column doesn't exist, add a default value

        if (!statusColumnExists && !organization.status) {

            organization.status = 'active'; // Default value

        }

        // Query the locations table for locations belonging to the organization

        const locationsResult = await (0, db_1.queryMainDb)(`SELECT *

       FROM locations

       WHERE organization_id = $1

       ORDER BY name ASC`, [orgId]);

        // Query the users table for users belonging to the organization

        const usersResult = await (0, db_1.queryMainDb)(`SELECT 

         id, email, first_name as "firstName", last_name as "lastName", 

         role, status, npi, specialty, phone_number, organization_id,

         created_at, updated_at, last_login, email_verified

       FROM users

       WHERE organization_id = $1

       ORDER BY last_name, first_name`, [orgId]);

        // Return the organization, locations, and users

        return {

            organization,

            locations: locationsResult.rows,

            users: usersResult.rows

        };

    }

    catch (error) {

        logger_1.default.error(`Error getting organization with ID ${orgId}:`, error);

        throw error;

    }

}

//# sourceMappingURL=get-my-organization.js.map

dist/services/organization/get-my-organization-fixed.js

        // First check if the status column exists in the organizations table

        const checkStatusColumn = await (0, db_1.queryMainDb)(`SELECT column_name 

       FROM information_schema.columns 

       WHERE table_name = 'organizations' AND column_name = 'status'`);

        const statusColumnExists = checkStatusColumn.rows.length > 0;

        // Query the organizations table for the organization with the given ID

        // Dynamically build the query based on whether the status column exists

        const orgQuery = `SELECT

      id, name, type, npi, tax_id, address_line1, address_line2,

      city, state, zip_code, phone_number, fax_number, contact_email,

      website, logo_url, billing_id, credit_balance, subscription_tier,

      ${statusColumnExists ? 'status,' : ''} created_at, updated_at

     FROM organizations

     WHERE id = $1`;

        const orgResult = await (0, db_1.queryMainDb)(orgQuery, [orgId]);

        // If no organization is found, return null

        if (orgResult.rows.length === 0) {

            return null;

        }

        const organization = orgResult.rows[0];

        // If status column doesn't exist, add a default value

        if (!statusColumnExists && !organization.status) {

            organization.status = 'active'; // Default value

        }

        // Query the locations table for locations belonging to the organization

        const locationsResult = await (0, db_1.queryMainDb)(`SELECT *

       FROM locations

       WHERE organization_id = $1

       ORDER BY name ASC`, [orgId]);

        // Query the users table for users belonging to the organization

        const usersResult = await (0, db_1.queryMainDb)(`SELECT 

         id, email, first_name as "firstName", last_name as "lastName", 

         role, status, npi, specialty, phone_number, organization_id,

         created_at, updated_at, last_login, email_verified

       FROM users

       WHERE organization_id = $1

       ORDER BY last_name, first_name`, [orgId]);

        // Return the organization, locations, and users

        return {

            organization,

            locations: locationsResult.rows,

            users: usersResult.rows

        };

    }

    catch (error) {

        logger_1.default.error(`Error getting organization with ID ${orgId}:`, error);

        throw error;

    }

}

//# sourceMappingURL=get-my-organization-fixed.js.map

dist/services/organization/get-my-organization.js

        // First check if the status column exists in the organizations table

        const checkStatusColumn = await (0, db_1.queryMainDb)(`SELECT column_name

       FROM information_schema.columns

       WHERE table_name = 'organizations' AND column_name = 'status'`);

        const statusColumnExists = checkStatusColumn.rows.length > 0;

        // Query the organizations table for the organization with the given ID

        // Dynamically build the query based on whether the status column exists

        const orgQuery = `SELECT

      id, name, type, npi, tax_id, address_line1, address_line2,

      city, state, zip_code, phone_number, fax_number, contact_email,

      website, logo_url, billing_id, credit_balance, subscription_tier,

      ${statusColumnExists ? 'status,' : ''} created_at, updated_at

     FROM organizations

     WHERE id = $1`;

        const orgResult = await (0, db_1.queryMainDb)(orgQuery, [orgId]);

        // If no organization is found, return null

        if (orgResult.rows.length === 0) {

            return null;

        }

        const organization = orgResult.rows[0];

        // If status column doesn't exist, add a default value

        if (!statusColumnExists && !organization.status) {

            organization.status = 'active'; // Default value

        }

        // Query the locations table for locations belonging to the organization

        const locationsResult = await (0, db_1.queryMainDb)(`SELECT *

       FROM locations

       WHERE organization_id = $1

       ORDER BY name ASC`, [orgId]);

        // Query the users table for users belonging to the organization

        const usersResult = await (0, db_1.queryMainDb)(`SELECT 

         id, email, first_name as "firstName", last_name as "lastName", 

         role, status, npi, specialty, phone_number, organization_id,

         created_at, updated_at, last_login, email_verified

       FROM users

       WHERE organization_id = $1

       ORDER BY last_name, first_name`, [orgId]);

        // Return the organization, locations, and users

        return {

            organization,

            locations: locationsResult.rows,

            users: usersResult.rows

        };

    }

    catch (error) {

        logger_1.default.error(`Error getting organization with ID ${orgId}:`, error);

        throw error;

    }

}

//# sourceMappingURL=get-my-organization.js.map


dist/index.js

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


dist/services/organization/index.js

"use strict";

/**

 * Organization service module

 *

 * This module exports all organization-related services

 */

Object.defineProperty(exports, "__esModule", { value: true });

exports.searchOrganizations = exports.updateOrganizationProfile = exports.getMyOrganization = void 0;

// Export the get-my-organization service from the fixed implementation

const get_my_organization_fixed_js_1 = require("./get-my-organization-fixed.js");

Object.defineProperty(exports, "getMyOrganization", { enumerable: true, get: function () { return get_my_organization_fixed_js_1.getMyOrganization; } });

// Export the update-organization-profile service

const update_organization_profile_service_js_1 = require("./update-organization-profile.service.js");

Object.defineProperty(exports, "updateOrganizationProfile", { enumerable: true, get: function () { return update_organization_profile_service_js_1.updateOrganizationProfile; } });

// Export the search-organizations service

const search_organizations_service_js_1 = require("./search-organizations.service.js");

Object.defineProperty(exports, "searchOrganizations", { enumerable: true, get: function () { return search_organizations_service_js_1.searchOrganizations; } });

//# sourceMappingURL=index.js.map