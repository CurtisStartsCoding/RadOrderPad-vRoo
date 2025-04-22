"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActivePromptTemplate = getActivePromptTemplate;
const db_1 = require("../../config/db");
const logger_1 = __importDefault(require("../../utils/logger"));
/**
 * Get the active default prompt template from the database
 */
async function getActivePromptTemplate() {
    logger_1.default.info("Looking for active default prompt template");
    const result = await (0, db_1.queryMainDb)(`SELECT * FROM prompt_templates
     WHERE type = 'default' AND active = true
     ORDER BY created_at DESC
     LIMIT 1`);
    logger_1.default.info("Prompt template query result:", result.rows);
    if (result.rows.length === 0) {
        throw new Error('No active default prompt template found');
    }
    return result.rows[0];
}
//# sourceMappingURL=prompt-template.js.map