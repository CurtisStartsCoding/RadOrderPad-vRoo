# RadOrderPad System Architecture Overview

## Introduction

RadOrderPad is a comprehensive platform designed to streamline the radiology ordering process between referring physicians and radiology organizations. The system facilitates clinical dictation validation, order management, administrative finalization, and radiology workflow processing.

## System Components

The RadOrderPad system consists of several key components:

### 1. API Server

The core of the system is a Node.js API server that handles all requests and business logic. The API server:

- Processes authentication and authorization
- Manages user and organization data
- Handles order creation, validation, and processing
- Facilitates connections between organizations
- Manages file uploads and downloads
- Processes billing and credit management

### 2. Dual Database Architecture

RadOrderPad employs a dual database architecture to separate Protected Health Information (PHI) from non-PHI data:

- **PHI Database (`radorder_phi`)**: Contains all patient data, orders, clinical indications, and other PHI
- **Main Database (`radorder_main`)**: Contains non-PHI data such as organizations, users, credit balances, and system configuration

For more details on the dual database architecture, see [Dual Database Architecture](./dual-database.md).

### 3. Validation Engine

The validation engine is a critical component that processes clinical dictations and assigns appropriate CPT and ICD-10 codes. It features:

- **LLM Orchestration**: Uses multiple LLM providers (Claude 3.7, Grok 3, GPT-4.0) with fallback mechanisms
- **Prompt Management**: Specialized prompts for different validation scenarios
- **Clarification Loop**: Interactive process for handling unclear dictations
- **Override Flow**: Mechanism for handling cases where automatic validation fails

### 4. File Storage

The system uses AWS S3 for secure file storage:

- Presigned URL pattern for direct uploads and downloads
- Secure access control to ensure only authorized users can access files
- Database records to track uploaded files and their associations

### 5. Notification System

The notification system keeps users informed about important events:

- Email notifications for connection requests, approvals, and rejections
- System notifications for order status changes
- Administrative alerts for credit balance updates

## High-Level Architecture Diagram

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Web Frontend   │◄───►│   API Server    │◄───►│  LLM Services   │
│                 │     │                 │     │                 │
└─────────────────┘     └────────┬────────┘     └─────────────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │                 │
                        │  AWS Services   │
                        │  (S3, SES)      │
                        │                 │
                        └─────────────────┘
                                 │
                                 ▼
          ┌───────────────────────────────────────┐
          │                                       │
┌─────────┴─────────┐               ┌─────────────┴─────────┐
│                   │               │                       │
│   PHI Database    │               │    Main Database      │
│  (Patient Data)   │               │ (Organizations, Users) │
│                   │               │                       │
└───────────────────┘               └───────────────────────┘
```

## Authentication and Authorization

The system implements a robust authentication and authorization mechanism:

- JWT-based authentication with refresh tokens
- Role-based access control (RBAC) with multiple roles:
  - `admin_staff`: Administrative staff at referring organizations
  - `physician`: Physicians at referring organizations
  - `admin_referring`: Administrators at referring organizations
  - `super_admin`: System administrators
  - `admin_radiology`: Administrators at radiology organizations
  - `scheduler`: Schedulers at radiology organizations
  - `radiologist`: Radiologists at radiology organizations
  - `trial_physician`: Trial users with limited access

For more details on the security model, see [Security Model](./security-model.md).

## Key Workflows

The system supports several key workflows:

1. **Validation Workflow**: Physician submits dictation → Validation processing → Clarification (if needed) → Override (if needed) → Finalization
2. **Admin Finalization**: Admin accesses queue → Updates patient/insurance info → Adds supplemental documentation → Sends to radiology
3. **Radiology Processing**: Radiology staff receives order → Updates status → Requests additional info (if needed) → Completes order
4. **Connection Management**: Organization requests connection → Target organization approves/rejects → Active connection established
5. **User Management**: Admin invites users → Users accept invitations → Admin assigns locations → Admin manages user profiles

## System Scalability and Performance

The RadOrderPad system is designed for scalability and performance:

- Stateless API design allows for horizontal scaling
- Database connection pooling for efficient resource utilization
- Redis caching for frequently accessed data
- Asynchronous processing for long-running tasks
- AWS S3 for scalable file storage

## Monitoring and Logging

The system includes comprehensive monitoring and logging:

- LLM validation logs for tracking validation performance
- Credit usage logs for billing transparency
- Purgatory event logs for security monitoring
- System logs for troubleshooting and performance monitoring

## Conclusion

The RadOrderPad system architecture is designed to provide a secure, scalable, and efficient platform for radiology order management. The dual database architecture ensures PHI security, while the validation engine provides accurate CPT and ICD-10 code assignment. The modular design allows for easy maintenance and future enhancements.