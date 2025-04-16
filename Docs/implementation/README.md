# RadOrderPad Implementation Documentation

Welcome to the RadOrderPad implementation documentation. This documentation provides detailed information about the implementation of the RadOrderPad application, focusing on the Validation Engine component.

## Table of Contents

1. [Implementation Summary](./2025-04-13-implementation-summary.md) - Summary of changes made on April 13, 2025
2. [Validation Engine Architecture](./validation-engine-architecture.md) - Overview of the Validation Engine architecture
3. [Troubleshooting Guide](./troubleshooting-guide.md) - Solutions for common issues
4. [Validation Engine Implementation Report](./validation-engine-implementation-report.md) - Comprehensive report on implementation and testing
5. [2025-04-13 Accomplishments](./2025-04-13-accomplishments.md) - Summary of accomplishments on April 13, 2025

## Overview

The RadOrderPad application is a system for managing radiology orders, with a focus on validating the appropriateness of requested imaging studies based on clinical indications. The Validation Engine is a core component that uses Large Language Models (LLMs) to analyze dictation text and provide feedback.

## Key Components

- **Validation Engine**: Analyzes dictation text and validates the appropriateness of requested imaging studies
- **Database System**: Stores order information, patient data, and validation results
- **API Layer**: Provides endpoints for order creation, validation, and management
- **Authentication System**: Manages user authentication and authorization

## Getting Started

To get started with the RadOrderPad application:

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables in `.env` file
4. Start the database: `docker-compose up -d`
5. Start the server: `npm run dev`

## Environment Setup

The application requires the following environment variables:

```
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
MAIN_DATABASE_URL=postgres://postgres:postgres123@localhost:5433/radorder_main
PHI_DATABASE_URL=postgres://postgres:postgres123@localhost:5433/radorder_phi

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=24h

# LLM API Keys
ANTHROPIC_API_KEY=your_anthropic_api_key_here
GROK_API_KEY=your_grok_api_key_here
OPENAI_API_KEY=your_openai_api_key_here

# LLM Model Names
CLAUDE_MODEL_NAME=claude-3-7-sonnet-20250219
GROK_MODEL_NAME=grok-3
GPT_MODEL_NAME=gpt-4-turbo

# LLM Settings
LLM_MAX_TOKENS=4000
LLM_TIMEOUT=30000
```

## API Endpoints

The application provides the following API endpoints:

- `POST /api/orders/validate`: Validate a radiology order
- `PUT /api/orders/:orderId`: Finalize a radiology order
- `GET /api/orders/:orderId`: Get order details
- `GET /health`: Check server health

## Database Schema

The application uses two databases:

1. **radorder_main**: Stores non-PHI data (users, organizations, prompt templates, etc.)
2. **radorder_phi**: Stores PHI data (patients, orders, validation attempts, etc.)

## Recent Changes

### April 13, 2025

- Fixed database connection issues
- Updated prompt template handling
- Enhanced null value handling
- Added real LLM integration with Anthropic Claude and X.ai
- Created comprehensive documentation

## Testing

To test the Validation Engine:

```powershell
# Test the validation endpoint
Invoke-WebRequest -Uri "http://localhost:3000/api/orders/validate" -Method POST -Headers @{"Authorization"="Bearer YOUR_TOKEN_HERE"; "Content-Type"="application/json"} -Body '{"dictationText":"Patient with persistent headache for 3 weeks, worsening with movement. History of migraines. Request MRI brain to rule out structural abnormalities.", "patientInfo": {"id": 1}, "radiologyOrganizationId": 1}'
```

## Contributing

When contributing to this project, please follow these guidelines:

1. Create a new branch for each feature or bugfix
2. Write tests for new functionality
3. Update documentation as needed
4. Submit a pull request for review

## License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.