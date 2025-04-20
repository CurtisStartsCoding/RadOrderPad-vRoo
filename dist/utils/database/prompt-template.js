import { queryMainDb } from '../../config/db';
/**
 * Get the active default prompt template from the database
 */
export async function getActivePromptTemplate() {
    console.log("Looking for active default prompt template");
    const result = await queryMainDb(`SELECT * FROM prompt_templates
     WHERE type = 'default' AND active = true
     ORDER BY created_at DESC
     LIMIT 1`);
    console.log("Prompt template query result:", result.rows);
    if (result.rows.length === 0) {
        throw new Error('No active default prompt template found');
    }
    return result.rows[0];
}
//# sourceMappingURL=prompt-template.js.map