/**
 * Format database context from query results
 */
export function formatDatabaseContext(icd10Rows, cptRows, mappingRows, markdownRows) {
    // Construct the database context
    let context = '';
    // Add ICD-10 codes
    if (icd10Rows.length > 0) {
        context += '-- Relevant ICD-10 Codes --\n';
        icd10Rows.forEach(row => {
            context += `${row.icd10_code} - ${row.description}\n`;
            if (row.clinical_notes)
                context += `Clinical Notes: ${row.clinical_notes}\n`;
            if (row.imaging_modalities)
                context += `Recommended Imaging: ${row.imaging_modalities}\n`;
            if (row.primary_imaging)
                context += `Primary Imaging: ${row.primary_imaging}\n`;
            context += '\n';
        });
    }
    // Add CPT codes
    if (cptRows.length > 0) {
        context += '-- Relevant CPT Codes --\n';
        cptRows.forEach(row => {
            context += `${row.cpt_code} - ${row.description}\n`;
            if (row.modality)
                context += `Modality: ${row.modality}\n`;
            if (row.body_part)
                context += `Body Part: ${row.body_part}\n`;
            context += '\n';
        });
    }
    // Add mappings
    if (mappingRows.length > 0) {
        context += '-- Relevant ICD-10 to CPT Mappings --\n';
        mappingRows.forEach(row => {
            context += `ICD-10: ${row.icd10_code} (${row.icd10_description}) -> CPT: ${row.cpt_code} (${row.cpt_description})\n`;
            context += `Appropriateness Score: ${row.appropriateness}/9\n`;
            if (row.evidence_source)
                context += `Evidence Source: ${row.evidence_source}\n`;
            if (row.refined_justification)
                context += `Justification: ${row.refined_justification}\n`;
            context += '\n';
        });
    }
    // Add markdown docs
    if (markdownRows.length > 0) {
        context += '-- Additional Clinical Information --\n';
        markdownRows.forEach(row => {
            context += `ICD-10: ${row.icd10_code} (${row.icd10_description})\n`;
            context += `${row.content_preview}...\n\n`;
        });
    }
    if (context === '') {
        return 'No specific medical context found in the database for the input text.';
    }
    return context;
}
//# sourceMappingURL=context-formatter.js.map