# RadOrderPad

A comprehensive radiology order validation system that evaluates imaging orders and provides appropriate ICD-10 and CPT code suggestions with proper primary code identification.

## Overview

RadOrderPad is designed to improve the accuracy and efficiency of radiology ordering by:

1. Validating imaging orders against established medical guidelines
2. Suggesting appropriate ICD-10 diagnosis codes and CPT procedure codes
3. Identifying primary codes for billing and documentation
4. Providing evidence-based justifications for imaging recommendations

## Features

- **Comprehensive Validation Framework**: Evaluates orders based on modality-indication alignment, clinical information sufficiency, and specialty-specific criteria
- **Intelligent Code Suggestion**: Recommends appropriate ICD-10 and CPT codes based on clinical information
- **Primary Code Identification**: Properly identifies primary diagnosis codes for billing purposes
- **Evidence-Based Recommendations**: Provides justifications based on medical guidelines and literature
- **Specialty-Specific Validation**: Tailors validation criteria to different medical specialties

## Technical Architecture

- **Backend**: Node.js with TypeScript
- **Database**: PostgreSQL
- **Medical Data**: 
  - 46,666 ICD-10 diagnosis codes
  - 362 CPT procedure codes
  - 1,915 CPT-ICD10 mappings
  - 932 ICD-10 markdown documentation files

## Project Structure

- `src/`: Source code
- `Docs/`: Documentation
- `debug-scripts/`: Utility scripts for debugging and maintenance
- `Data/`: Medical data and import files
- `tests/`: Test files

## Setup and Installation

### Prerequisites

- Node.js (v14+)
- PostgreSQL (v12+)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/RadOrderPad.git
   cd RadOrderPad
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   ```
   cp .env.example .env
   ```
   Edit `.env` with your database credentials and other configuration.

4. Set up the database:
   ```
   psql -U postgres -f radorderpad_schema.sql
   ```

5. Import medical data:
   ```
   node debug-scripts/import_using_node.js
   ```

6. Verify module system configuration:
   ```
   node scripts/verify-module-config.js
   ```

7. Start the development server:
   ```
   npm run dev
   ```

## Documentation

- `ORDER_API_README.md`: API documentation
- `Docs/core_principles.md`: Core principles of the validation system
- `Docs/field-naming-fix-summary.md`: Summary of field naming fixes
- `Docs/module-system-fix.md`: Documentation of the module system fix
- `Docs/aws-deployment-guide.md`: Guide for deploying to AWS
- `Docs/prompt_examples/`: Example prompts for the validation system
- `debug-scripts/README.md`: Documentation for utility scripts

## Recent Improvements

- Fixed module system configuration to ensure compatibility between TypeScript and Node.js
- Fixed a critical bug in the code normalization process that was stripping the isPrimary flag from ICD-10 codes
- Successfully imported comprehensive medical data including CPT codes, ICD-10 codes, and mappings
- Implemented a comprehensive validation framework with specialty-specific criteria
- Created detailed documentation for prompt management and testing

## License

[MIT License](LICENSE)

## Acknowledgements

- American College of Radiology (ACR) for Appropriateness Criteria
- World Health Organization (WHO) for ICD-10 codes
- American Medical Association (AMA) for CPT codes