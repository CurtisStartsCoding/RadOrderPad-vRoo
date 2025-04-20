"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.constructPrompt = constructPrompt;
/**
 * Construct the prompt for the LLM
 */
function constructPrompt(templateContent, sanitizedText, databaseContext, wordLimit, isOverrideValidation) {
    let prompt = templateContent;
    // Replace placeholders safely
    prompt = prompt.replace('{{DATABASE_CONTEXT}}', databaseContext || '');
    prompt = prompt.replace('{{DICTATION_TEXT}}', sanitizedText || '');
    prompt = prompt.replace('{{WORD_LIMIT}}', wordLimit != null ? wordLimit.toString() : '500'); // default to 500 if missing
    if (isOverrideValidation) {
        prompt += `

IMPORTANT: This is an OVERRIDE validation request. The physician has provided justification for why they believe this study is appropriate despite potential guidelines to the contrary. Please consider this justification carefully in your assessment.`;
    }
    return prompt;
}
//# sourceMappingURL=prompt-constructor.js.map