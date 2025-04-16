# Medical Data Import and Validation Scripts

This directory contains scripts for importing, validating, and managing medical data in the RadOrderPad database.

## Import Scripts

### `import_using_node.js`

Imports medical data from SQL files using Node.js. This script properly handles multiline SQL statements and is more reliable than using psql directly.

```bash
node debug-scripts/import_using_node.js
```

### `import_using_psql_fixed.js`

An alternative import script that uses psql but with improved path handling. May encounter authentication issues with psql.

```bash
node debug-scripts/import_using_psql_fixed.js
```

## Validation Scripts

### `validate_data_integrity.js`

Performs a comprehensive validation of data integrity, checking referential integrity, data quality, distribution, and potential anomalies.

```bash
node debug-scripts/validate_data_integrity.js
```

### `analyze_duplicates_and_retired_codes.js`

Analyzes duplicate mappings in detail and identifies retired CPT codes in markdown files.

```bash
node debug-scripts/analyze_duplicates_and_retired_codes.js
```

### `generate_fix_duplicates_sql.js`

Generates SQL statements to fix duplicate mappings but does NOT execute them directly. Instead, it saves the SQL to a file for review.

```bash
node debug-scripts/generate_fix_duplicates_sql.js
```

## Utility Scripts

### `check_db_connection.js`

Checks the database connection details and runs a simple query to verify connectivity.

```bash
node debug-scripts/check_db_connection.js
```

### `show_exact_problematic_line.js`

Shows the exact problematic line in a SQL file, useful for debugging import issues.

```bash
node debug-scripts/show_exact_problematic_line.js
```

## Documentation

A comprehensive report on the medical data import process and data quality is available at:

- `Docs/medical_data_import_report.md`

Detailed analysis of duplicate mappings and retired codes is available at:

- `Data/duplicates_and_retired_codes_report.md`