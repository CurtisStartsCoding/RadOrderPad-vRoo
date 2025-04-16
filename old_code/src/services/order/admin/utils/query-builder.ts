/**
 * Utility for building SQL update queries
 */

/**
 * Result of building an update query
 */
export interface UpdateQueryResult {
  query: string;
  values: any[];
}

/**
 * Build an SQL update query
 * @param tableName Name of the table to update
 * @param updateData Object containing field/value pairs to update
 * @param idField Name of the ID field (default: 'id')
 * @param idValue Value of the ID
 * @param fieldMap Optional mapping of object keys to database columns
 * @param includeTimestamp Whether to include updated_at = NOW() (default: true)
 * @param returnFields Fields to return (default: ['id'])
 * @returns Object containing the query string and parameter values
 */
export function buildUpdateQuery(
  tableName: string,
  updateData: { [key: string]: any },
  idField: string = 'id',
  idValue: any,
  fieldMap?: { [key: string]: string },
  includeTimestamp: boolean = true,
  returnFields: string[] = ['id']
): UpdateQueryResult {
  const updateFields = [];
  const updateValues = [];
  let valueIndex = 1;
  
  // Process each field in the update data
  for (const [key, value] of Object.entries(updateData)) {
    if (value === undefined) continue;
    
    // Get the database column name (either from fieldMap or use the key directly)
    const columnName = fieldMap ? fieldMap[key] || key : key;
    
    updateFields.push(`${columnName} = $${valueIndex}`);
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

/**
 * Build an SQL update query from a list of field/value pairs
 * @param tableName Name of the table to update
 * @param fieldValuePairs Array of objects with field and value properties
 * @param idField Name of the ID field (default: 'id')
 * @param idValue Value of the ID
 * @param includeTimestamp Whether to include updated_at = NOW() (default: true)
 * @param returnFields Fields to return (default: ['id'])
 * @returns Object containing the query string and parameter values
 */
export function buildUpdateQueryFromPairs(
  tableName: string,
  fieldValuePairs: { field: string, value: any }[],
  idField: string = 'id',
  idValue: any,
  includeTimestamp: boolean = true,
  returnFields: string[] = ['id']
): UpdateQueryResult {
  const updateFields = [];
  const updateValues = [];
  let valueIndex = 1;
  
  // Process each field/value pair
  for (const { field, value } of fieldValuePairs) {
    if (value === undefined) continue;
    
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

export default {
  buildUpdateQuery,
  buildUpdateQueryFromPairs
};