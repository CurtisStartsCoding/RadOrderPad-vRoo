# Workflow Documentation

This directory contains detailed documentation about the RadOrderPad application workflows, UI flows, and API interactions. These documents provide essential context for understanding how the validation engine is used within the application.

## Files in this Directory

- **ui_stepflow_logic.md**: Outlines the high-level screen sequences and UI state transitions for the primary user workflows in RadOrderPad, including the physician order creation flow, admin staff finalization flow, and radiology group workflow.

- **physician_dictation_experience_with_override_schema_update.md**: Contains React component code and implementation details for the physician dictation experience, including the override functionality which is a key part of the validation workflow.

- **physician_order_flow.md**: Describes the end-to-end workflow for a physician using RadOrderPad to submit a radiology order, including the validation loop and override flow which are core to the validation engine.

- **workflow-guide.md**: Provides a comprehensive guide to the API workflow for the RadOrderPad application, focusing on the full physician order with validation and finalization.

## Relationship to Validation Engine

These workflow documents are closely related to the validation engine documentation:

- They describe how the validation engine is integrated into the user interface
- They explain the API interactions that trigger the validation engine
- They detail the user workflows that depend on the validation engine
- They provide context for understanding the validation engine's role in the application

## Original Files

These files are exact copies of the original documentation, preserved to maintain all the detailed information that was used as the basis for the codebase.