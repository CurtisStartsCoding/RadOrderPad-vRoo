/**
 * Script to update field names in prompt templates to match the standard
 */
const fs = require('fs');
const path = require('path');

// Files to update
const filesToUpdate = [
  path.join(__dirname, '..', 'Docs', 'NEW SUPER DUPER ULTRA GOD PROMPT.txt'),
  // Add other prompt files here if needed
];

// Field name mappings
const fieldNameMappings = {
  'diagnosisCodes': 'suggestedICD10Codes',
  'procedureCodes': 'suggestedCPTCodes',
  'validationStatus': 'validationStatus', // Already correct, included for completeness
  'complianceScore': 'complianceScore', // Already correct, included for completeness
  'feedback': 'feedback', // Already correct, included for completeness
};

// Fields to remove entirely (with their JSON structure)
const fieldsToRemove = [
  'primaryDiagnosis',
  'codeJustification'
];

// Process each file
filesToUpdate.forEach(filePath => {
  console.log(`Processing ${path.basename(filePath)}...`);
  
  try {
    // Read the file
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // Apply the mappings
    Object.entries(fieldNameMappings).forEach(([oldName, newName]) => {
      // Use regex to replace the field names while preserving formatting
      const regex = new RegExp(`"${oldName}"`, 'g');
      content = content.replace(regex, `"${newName}"`);
      
      // Also replace any references to the field names in text
      const textRegex = new RegExp(`\`${oldName}\``, 'g');
      content = content.replace(textRegex, `\`${newName}\``);
    });
    
    // Remove fields that should be removed entirely
    fieldsToRemove.forEach(fieldToRemove => {
      // Remove the field from JSON structure (including the line with the field name, value, and comma if present)
      // This regex matches:
      // 1. "fieldName": value, - with comma
      // 2. "fieldName": value - without comma (last item in object)
      const jsonFieldRegex = new RegExp(`\\s*"${fieldToRemove}"\\s*:\\s*[^,}]+(,)?\\s*\\n?`, 'g');
      content = content.replace(jsonFieldRegex, '');
      
      // Also remove any references to the field in text
      const textRegex = new RegExp(`\`${fieldToRemove}\``, 'g');
      content = content.replace(textRegex, '');
    });
    
    // Check if any changes were made
    if (content === originalContent) {
      console.log(`No changes needed for ${path.basename(filePath)}`);
    } else {
      // Write the updated content back to the file
      fs.writeFileSync(filePath, content);
      console.log(`Updated ${path.basename(filePath)}`);
    }
  } catch (error) {
    console.error(`Error processing ${path.basename(filePath)}:`, error.message);
  }
});

console.log('Done!');