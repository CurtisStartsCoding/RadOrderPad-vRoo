# Core Principles

**Version:** 1.1 (Added Strict Modularity Guideline)
**Date:** 2025-04-13

These are the non-negotiable principles guiding the design, development, and maintenance of the RadOrderPad platform. **Adherence to these principles, especially regarding Modularity and File Structure (3.1, 3.2), is mandatory for all code generation.**

---

## 1. User Experience First

- **Minimalism & Elegance:** Prioritize clarity, simplicity, and a clean aesthetic inspired by Jony Ive. Reduce cognitive load at every step.
- **Efficiency:** Optimize for speed and minimal clicks, especially for the physician workflow. Dictation should be seamless.
- **Mobile & Touch Primary (Physician):** The physician interface must be flawless on tablets and mobile devices. Desktop is secondary for this role.
- **Desktop Primary (Admin/Radiology):** Admin and Radiology workflows are optimized for desktop use.
- **Progressive Web App (PWA):** Deliver a fast, installable, reliable experience across all platforms.

## 2. Clinical Intelligence & Safety

- **Accuracy:** Strive for the highest possible accuracy in ICD-10/CPT code suggestion and appropriateness validation.
- **Decision Support, Not Replacement:** The system provides guidance, feedback, and scores, but the physician retains final clinical authority (via override).
- **Teachable Moments:** Feedback should be concise, educational, and actionable, fostering user trust and improvement.
- **Dot-Connecting Engine:** Leverage LLMs and data to surface potential missed diagnoses or patterns (e.g., rare diseases), adding value beyond simple validation.

## 3. Technical Excellence

- **3.1 Modularity & Single Responsibility:** Codebase and documentation must be broken down into the smallest logical, single-responsibility modules possible. Complex logic within services or controllers must be extracted into dedicated utility functions or smaller, focused service modules.
- **3.2 Strict File Structure & Size:** **Implement new backend functionality (especially service logic) using a "single function per file" approach where feasible.** Create new `.ts` files within logical subdirectories (e.g., `src/services/admin-order/sendToRadiology.ts`) containing primarily one exported function and its private helpers. Aim to keep most files **well under 150 lines**. Use barrel files (`index.ts`) for exporting. **Refer back to this principle.**
- **3.3 Database Separation:** Strict physical separation between PHI (`radorder_phi`) and non-PHI (`radorder_main`) databases is mandatory for HIPAA compliance. Application logic must explicitly target the correct database connection.
- **3.4 Performance:** Leverage caching (Redis/RedisSearch) appropriately for database lookups and validation context to ensure rapid response times (to be implemented).
- **3.5 Scalability:** Design with serverless principles (Lambda) and scalable databases (RDS) in mind for future growth.
- **3.6 Testability:** Emphasize unit and integration testing. Smaller, focused modules (see 3.1, 3.2) facilitate easier testing.

## 4. Operational Integrity

- **HIPAA Compliance:** Adhere strictly to all technical, physical, and administrative safeguards required by HIPAA, particularly the database separation outlined in 3.3.
- **Security:** Implement robust security practices at all layers (authentication, authorization, network, data handling).
- **Zero Integration Burden:** Onboarding for referring and radiology groups must not require direct EMR/RIS integration. Leverage copy/paste and standard export formats (PDF, CSV, JSON, FHIR, HL7).
- **Maintainability:** Consistent naming conventions (`snake_case` for DB/API, `camelCase` for TS files/functions), clear documentation, and strict modular design (3.1, 3.2) are crucial for long-term maintenance.
- **Order Immutability:** Core clinical components of an order (original dictation, final validated codes/status, signature) are immutable after physician signature, ensuring audit trail integrity. Subsequent administrative steps append necessary contextual data.

## 5. Naming Conventions

- **Database Tables & Columns:** `snake_case`
- **API Endpoint Paths:** `/api/resource_name/{id}/action_name` (e.g., `/api/orders/validate`)
- **API JSON Keys:** `camelCase` (Common for Node.js/TypeScript APIs - adjust if you prefer `snake_case`)
- **Environment Variables:** `UPPER_SNAKE_CASE`
- **TypeScript Files/Modules:** `kebab-case.ts` (e.g., `admin-order.service.ts`) or `camelCase.ts`. Be consistent.
- **TypeScript Functions/Variables:** `camelCase`.
- **TypeScript Classes:** `PascalCase`.
- **TypeScript Interfaces/Types:** `PascalCase`.
- **LLM Output Formats:** `camelCase` for all JSON keys, matching TypeScript interfaces exactly.

### 5.1 Standard Field Names for LLM Validation Responses

LLM validation responses must use these exact field names to ensure consistency:

```json
{
  "validationStatus": "appropriate|needs_clarification|inappropriate",
  "complianceScore": 1-9,
  "feedback": "Educational message if needed",
  "suggestedICD10Codes": [
    {"code": "X00.0", "description": "Description", "isPrimary": true},
    {"code": "X00.1", "description": "Description", "isPrimary": false}
  ],
  "suggestedCPTCodes": [
    {"code": "00000", "description": "Description"}
  ],
  "internalReasoning": "Reasoning behind the validation decision"
}
```

**IMPORTANT:** Do not use alternative field names like `diagnosisCodes` or `procedureCodes`. All prompt templates must adhere to these standard field names.
