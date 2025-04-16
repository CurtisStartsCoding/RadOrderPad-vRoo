"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserSpecialty = getUserSpecialty;
exports.getOptimalWordCount = getOptimalWordCount;
/**
 * Specialty-related utility functions
 */
const db_1 = require("../../config/db");
/**
 * Get user's specialty from the database
 * @param userId The ID of the user
 * @returns The user's specialty or 'General Radiology' if not found
 */
async function getUserSpecialty(userId) {
    try {
        console.log(`Getting specialty for user ID: ${userId}`);
        const result = await (0, db_1.queryMainDb)(`SELECT specialty FROM users WHERE id = $1`, [userId]);
        if (result.rows.length === 0 || !result.rows[0].specialty) {
            console.log(`No specialty found for user ID ${userId}, using default`);
            return 'General Radiology'; // Default specialty
        }
        console.log(`Found specialty for user ID ${userId}: ${result.rows[0].specialty}`);
        return result.rows[0].specialty;
    }
    catch (error) {
        console.error('Error getting user specialty:', error);
        return 'General Radiology'; // Default specialty on error
    }
}
/**
 * Get optimal word count for a specialty from the database
 * @param specialty The specialty name
 * @returns The optimal word count for the specialty or 33 if not found
 */
async function getOptimalWordCount(specialty) {
    try {
        console.log(`Getting optimal word count for specialty: ${specialty}`);
        const result = await (0, db_1.queryMainDb)(`SELECT optimal_word_count FROM specialty_configurations WHERE specialty_name = $1`, [specialty]);
        if (result.rows.length === 0) {
            console.log(`No optimal word count found for specialty ${specialty}, using default`);
            return 33; // Default word count
        }
        console.log(`Found optimal word count for specialty ${specialty}: ${result.rows[0].optimal_word_count}`);
        return result.rows[0].optimal_word_count;
    }
    catch (error) {
        console.error('Error getting optimal word count:', error);
        return 33; // Default word count on error
    }
}
//# sourceMappingURL=specialty-utils.js.map