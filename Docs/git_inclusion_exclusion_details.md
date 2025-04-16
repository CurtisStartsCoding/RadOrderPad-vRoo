# Git Repository Inclusion and Exclusion Details

This document provides a detailed breakdown of what will be included in and excluded from your Git repository based on the current `.gitignore` configuration.

## What Will Be INCLUDED in the Repository

### Source Code
- All source code files in `src/` directory
- All TypeScript configuration files
- All JavaScript files in the root and subdirectories (except those specifically excluded)

### Documentation
- All documentation in the `Docs/` directory
- All markdown (`.md`) files including README.md and ORDER_API_README.md
- All documentation examples and templates

### Scripts
- All debug scripts in `debug-scripts/` directory
- All utility scripts
- All batch files (`.bat`) and shell scripts (`.sh`)

### Tests
- All test files in `tests/` directory
- All test configuration files
- All test scripts and utilities

### Configuration
- Package configuration (`package.json`)
- Docker configuration (`docker-compose.yml`)
- TypeScript configuration (`tsconfig.json`)
- Example environment file (`.env.example`)

### SQL Files (Selectively)
The following SQL files are explicitly INCLUDED:
- `radorderpad_schema.sql`
- `import_cpt_codes.sql`
- `import_icd10_batched.sql`
- `update_prompt_template.sql`
- `insert_comprehensive_prompt.sql`
- `update_comprehensive_prompt.sql`
- `verify_prompt_insertion.sql`
- `verify_import.sql`

## What Will Be EXCLUDED from the Repository

### Environment and Secrets
- Environment files (`.env`, `.env.test`, etc.)
- Any files containing API keys, passwords, or other secrets

### Dependencies
- `node_modules/` directory and all its contents
- Any package manager lock files not needed for reproduction

### Build Artifacts
- `dist/` and `build/` directories
- Compiled code and bundles

### Large Data Files
- Large SQL database dumps in the `Data/` directory
- Database backup files (`*_backup_*.sql`)
- Data batch files in `Data/batches/`
- Data table files in `Data/tables/`
- Data upsert files in `Data/upsert/`

### Logs and Temporary Files
- Log files (`*.log`)
- Temporary files (`*.tmp`, `*.temp`)
- Debug log files (`debug-*.log`)

### OS and Editor Files
- OS-specific files (`.DS_Store`, `Thumbs.db`)
- Editor-specific files and directories (most `.vscode/` contents)

## Rationale for Exclusions

1. **Large SQL Files**: Database dumps and large SQL files are excluded because:
   - They can be very large (many megabytes or gigabytes)
   - They often contain data that can be regenerated
   - They may change frequently, causing large diffs in the repository
   - They may contain sensitive information

2. **Environment Files**: These are excluded because:
   - They often contain sensitive information like API keys and passwords
   - They typically contain machine-specific configuration

3. **Node Modules**: These are excluded because:
   - They are very large (often hundreds of megabytes)
   - They can be regenerated using `npm install` based on package.json
   - They are platform-specific in some cases

## Important Notes

1. **SQL Schema Files**: While most SQL files are excluded, the schema file (`radorderpad_schema.sql`) and important import scripts are explicitly included to ensure the database structure can be reproduced.

2. **Test Files**: All test files are included to ensure testing can be performed on any clone of the repository.

3. **Debug Scripts**: All debug scripts are included to ensure debugging capabilities are available to all developers.

4. **Documentation**: All documentation is included to ensure knowledge transfer and project understanding.

## How to Handle Excluded Files

For files that are excluded from the repository but necessary for the project:

1. **Database Dumps**: Create scripts to generate the necessary database structure and seed data, rather than including the dumps themselves.

2. **Environment Files**: Include a `.env.example` file with the required variables but dummy values, which developers can copy to `.env` and fill in with their own values.

3. **Large Data Files**: Document how to obtain or generate these files, or consider using Git LFS (Large File Storage) for truly necessary large files.