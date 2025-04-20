/**
 * Build an SQL update query from a list of field/value pairs
 * @param tableName Name of the table to update
 * @param fieldValuePairs Array of objects with field and value properties
 * @param idField Name of the ID field (default: 'id')
 * @param idValue Value of the ID field
 * @param includeTimestamp Whether to include updated_at = NOW() (default: true)
 * @param returnFields Fields to return (default: ['id'])
 * @returns Object containing the query string and parameter values
 */
export function buildUpdateQueryFromPairs(tableName, fieldValuePairs, idField = 'id', idValue, includeTimestamp = true, returnFields = ['id']) {
    const updateFields = [];
    const updateValues = [];
    let valueIndex = 1;
    // Process each field/value pair
    for (const { field, value } of fieldValuePairs) {
        if (value === undefined)
            continue;
        updateFields.push(`${field} = $${valueIndex}`);
        updateValues.push(value);
        valueIndex++;
    }
    if (updateFields.length === 0) {
        throw new Error('No valid fields provided for update');
    }
    // Add timestamp if requested
    if (includeTimestamp) {
        updateFields.push(`updated_at = NOW()`);
    }
    // Build the query
    const returningClause = returnFields.length > 0
        ? `RETURNING ${returnFields.join(', ')}`
        : '';
    const query = `
    UPDATE ${tableName}
    SET ${updateFields.join(', ')}
    WHERE ${idField} = $${valueIndex}
    ${returningClause}
  `;
    return {
        query,
        values: [...updateValues, idValue]
    };
}
//# sourceMappingURL=build-update-query-from-pairs.js.map