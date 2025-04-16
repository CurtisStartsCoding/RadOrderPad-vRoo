# Prompt Management UI

**Version:** 1.0
**Date:** 2025-04-15

This document specifies the design and functionality of the Prompt Management interface within the Super Admin console.

---

## 1. Purpose

- **Centralized Management:** Provide a unified interface for creating, editing, and managing prompt templates
- **Version Control:** Enable tracking of prompt changes over time
- **A/B Testing:** Facilitate the setup and analysis of prompt experiments
- **Quality Assurance:** Support testing and validation of prompts before deployment

## 2. User Interface Design

The Prompt Management UI is integrated into the Super Admin console and follows the same design patterns and principles.

### 2.1. Navigation & Layout

- **Access Path:** Super Admin Console → Validation & LLM Analytics → Prompt Management
- **Layout:** Three-panel design
  * Left Panel: Prompt List
  * Center Panel: Detail View (with tabs)
  * Right Panel: Documentation & Help (collapsible)

### 2.2. Prompt List (Left Panel)

![Prompt List Panel](./images/prompt_list_panel.png)

- **Header:**
  * Title: "Prompt Templates"
  * "Create New" button
  * Search field
  * Filter dropdown (Type, Status, Date Modified)

- **List Items:** Each prompt template is displayed as a card with:
  * Name
  * Type (default/specialty/custom) with color coding
  * Version
  * Active status (green dot for active)
  * Last modified date
  * Quick action buttons (View, Duplicate, Activate/Deactivate)

- **Sorting Options:**
  * Alphabetical (A-Z, Z-A)
  * Date Modified (Newest, Oldest)
  * Type
  * Status (Active, Inactive)

### 2.3. Detail View (Center Panel)

The Detail View is organized into tabs for different aspects of prompt management:

#### 2.3.1. Overview Tab

![Overview Tab](./images/prompt_overview_tab.png)

- **Metadata Section:**
  * Name (editable)
  * Type (dropdown: default, rare_disease, low_confidence, etc.)
  * Version (editable)
  * Created Date (read-only)
  * Last Modified Date (read-only)
  * Created By (read-only)
  * Status toggle (Active/Inactive)

- **Description Field:**
  * Multi-line text area for describing the prompt's purpose and behavior

- **Quick Actions:**
  * Save Changes
  * Duplicate
  * Export (JSON)
  * Delete (with confirmation)

#### 2.3.2. Editor Tab

![Editor Tab](./images/prompt_editor_tab.png)

- **Rich Text Editor:**
  * Syntax highlighting for different sections
  * Line numbers
  * Code folding
  * Search/replace functionality
  * Template variable highlighting (e.g., {{PATIENT_CASE}})

- **Editor Controls:**
  * Character count and size indicator
  * Save button
  * Revert changes button
  * Format code button

- **Split View Option:**
  * Toggle to show template and preview side by side
  * Preview shows how the template would look with sample data

- **Validation Warnings:**
  * Inline warnings for missing critical elements
  * Suggestions for improving the prompt

#### 2.3.3. History Tab

![History Tab](./images/prompt_history_tab.png)

- **Version List:**
  * Table showing all versions with:
    * Version number
    * Date modified
    * Modified by
    * Change notes
  * Select checkboxes for comparison

- **Comparison View:**
  * Side-by-side diff highlighting when two versions are selected
  * Option to restore to any previous version (with confirmation)

- **Change Notes:**
  * Text area for adding notes when saving a new version

#### 2.3.4. Test Tab

![Test Tab](./images/prompt_test_tab.png)

- **Input Section:**
  * Sample patient case text area
  * "Test Prompt" button
  * Model selection dropdown (Claude/GPT/etc.)
  * Temperature slider
  * Max tokens input

- **Results Section:**
  * Raw LLM response (collapsible)
  * Processed response as it would appear in the application
  * Validation checks (e.g., isPrimary flag present, minimum ICD-10 codes)
  * Performance metrics (tokens used, response time, cost)

- **Test History:**
  * List of recent test runs with timestamps
  * Option to compare results between tests

#### 2.3.5. Settings Tab

![Settings Tab](./images/prompt_settings_tab.png)

- **Model Settings:**
  * Default model selection
  * Temperature and other parameters
  * Token limit settings

- **Access Control:**
  * User/role permissions for editing this prompt
  * Approval workflow settings

- **Integration Settings:**
  * Which parts of the application use this prompt
  * Default word limit for feedback

- **Advanced Options:**
  * Custom headers or formatting options
  * Special handling instructions

### 2.4. Documentation Panel (Right Panel)

![Documentation Panel](./images/prompt_docs_panel.png)

- **Collapsible panel** with contextual help:
  * Template structure guide
  * Required elements checklist
  * Best practices
  * Common errors and solutions
  * Example prompts for reference

- **Links to full documentation:**
  * Prompt Template Guide
  * Prompt Testing Guide
  * Prompt Registry Documentation

## 3. Workflow Features

### 3.1. Creating a New Prompt

1. Click "Create New" button in the Prompt List panel
2. Select a template type (blank, comprehensive validation, rare disease, etc.)
3. Enter basic metadata (name, type, description)
4. Edit the prompt content in the Editor tab
5. Test the prompt with sample cases
6. Save as draft or publish directly

### 3.2. Editing an Existing Prompt

1. Select the prompt from the Prompt List
2. Make changes in the Editor tab
3. Add change notes
4. Test the changes
5. Save as a new version

### 3.3. A/B Testing Setup

![A/B Testing Setup](./images/prompt_ab_testing.png)

1. Navigate to the A/B Testing section
2. Select prompts to compare
3. Define user groups or percentage split
4. Set test duration
5. Define success metrics
6. Launch test
7. View results in the Analytics dashboard

### 3.4. Approval Workflow

For organizations requiring change control:

1. Editor makes changes and submits for review
2. Reviewer receives notification
3. Reviewer can approve, reject, or request changes
4. Upon approval, prompt is published
5. All steps are logged in the version history

## 4. Analytics Integration

The Prompt Management UI integrates with the Analytics system to provide insights on prompt performance:

- **Performance Metrics:**
  * Validation success rate
  * Average compliance score
  * Fallback rate
  * Token usage and cost
  * Processing time

- **Comparison Views:**
  * Compare metrics between prompt versions
  * Compare A/B test results
  * Trend analysis over time

- **Feedback Analysis:**
  * User override frequency
  * Common override reasons
  * Physician satisfaction ratings

## 5. Technical Implementation

### 5.1. Frontend Components

- React components for each panel and tab
- Monaco Editor for the rich text editing experience
- Diff viewer for version comparison
- Chart.js for analytics visualizations

### 5.2. API Endpoints

- `GET /api/admin/prompts` - List all prompts
- `GET /api/admin/prompts/:id` - Get prompt details
- `POST /api/admin/prompts` - Create new prompt
- `PUT /api/admin/prompts/:id` - Update prompt
- `GET /api/admin/prompts/:id/versions` - Get version history
- `POST /api/admin/prompts/test` - Test a prompt
- `GET /api/admin/prompts/analytics` - Get performance analytics

### 5.3. Database Interactions

- Reads from and writes to the `prompt_templates` table
- Manages `prompt_assignments` for A/B testing
- Logs test results and analytics data

## 6. Security Considerations

- Access restricted to users with the `super_admin` role
- All prompt changes are logged with user ID and timestamp
- Approval workflow for sensitive changes
- No PHI is used in the testing interface by default

## 7. Future Enhancements

- **Collaborative Editing:** Allow multiple admins to work on prompts simultaneously
- **Template Library:** Pre-built templates for common use cases
- **AI-Assisted Optimization:** Suggestions for improving prompt effectiveness
- **Automated Testing:** Regression testing against a library of test cases
- **Import/Export:** Exchange prompts between environments (dev, staging, production)

---

## References

- [Prompt Registry](./prompt_registry.md) - System for managing and versioning prompts
- [Prompt Template Guide](./prompt_template_guide.md) - Guidelines for creating effective prompts
- [Prompt Testing](./prompt_testing.md) - Methodologies for testing prompts
- [Super Admin Console](./super_admin.md) - Overview of the Super Admin interface