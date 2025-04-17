# UI Components

**Version:** 1.1 (Updated for Override Implementation)
**Date:** 2025-04-11

This document defines the core reusable UI components for the RadOrderPad PWA, adhering to the principles outlined in `ui_ux_principles.md`. Components should be built using React/Svelte and styled with Tailwind CSS.

---

## 1. Layout & Navigation

-   **`AppShell`**: The main application wrapper containing header, main content area, and potentially a footer or sidebar (less likely given minimalist goal). Handles overall layout.
-   **`AppHeader`**: Top navigation bar.
    -   Props: `userInitials`, `organizationName`, `showBackButton`.
    -   Displays: Logo (small), Org Name, User Initials/Avatar, Logout button. Optional Back button.
-   **`PatientInfoCard`**: Compact display of patient info shown persistently during order flow.
    -   Props: `patient: Patient | null | undefined`, `onEditPatient?: () => void`.
    -   Displays: Name, DOB, MRN/PIDN. Highlights temporary/placeholder state. Provides "Add Patient" / "Edit Patient" button.
-   **`OrderProgressIndicator`**: Visual indicator (Steps 1-3) for the physician order workflow.
    -   Props: `currentStep: number`.
    -   Displays: Dots/icons showing Dictation -> Validation -> Signature progress.

## 2. Input & Controls

-   **`Button`**: Standard action button (from Shadcn/ui).
    -   Props: `variant`, `size`, `onClick`, `disabled`, `isLoading`, children (incl. icons).
    -   Styles: Defined variants with clear visual hierarchy, hover/active states.
-   **`Input`**: Standard text input field (from Shadcn/ui).
    -   Props: `label`, `placeholder`, `value`, `onChange`, `error`, `type`, `disabled`.
-   **`Textarea`**: Multi-line text input (from Shadcn/ui).
    -   Props: `label`, `placeholder`, `value`, `onChange`, `error`, `rows`.
-   **`DictationInput`**: (Implemented within `DictationForm`) Specialized large text area for clinical dictation.
    -   Features: Integrated voice input button (`Mic`/`Square` icon), clear button, character count. Uses Shadcn `Textarea`.
-   **`PasteInputBox`**: (As used in `admin_finalization.md`) Text area optimized for pasting large blocks of text.
    -   Props: `label`, `value`, `onChange`, `onProcessPaste`.
    -   Features: "Process Paste" button integrated or nearby. Likely uses Shadcn `Textarea`.
-   **`SignaturePad`**: (Implemented within `SignatureForm`) Canvas element for capturing drawn signatures.
    -   Features: "Clear" button, adjacent `Input` for typed name confirmation.
-   **`FileInput`**: (If used for supplemental docs instead of paste) Standard file input, styled consistently.
    -   Props: `label`, `onChange`, `acceptedFileTypes`.
-   **`Select`**: Dropdown component (from Shadcn/ui). Used for Gender, Identifier Type etc.

## 3. Display & Feedback

-   **`ValidationFeedbackBanner`**: (Implemented within `DictationForm`) Displays the outcome of an order validation attempt *when clarification is needed*.
    -   Features: Distinct style (Red/Yellow) based on severity. Shows feedback text. Contains contextual action buttons ("Add Clarification", "Override Validation").
-   **`ValidationView`**: Displays the *final* validation summary after successful validation or override.
    -   Props: `dictationText`, `validationResult`, `onBack`, `onSign`.
    -   Features: Shows overall status (Compliant/Override), original feedback (if any), override justification (if applicable), extracted codes, guideline checks. Action buttons ("Edit Dictation", "Sign Order"). Uses Shadcn `Card`, `Badge`.
-   **`ClarificationSection`**: (Implemented within `DictationForm`) Visual separator (`--------Additional Clarification----------`) added to the `Textarea` when user clicks "Add Clarification".
-   **`DataTable`**: Used for displaying queues (Admin, Radiology). Likely uses a library like `@tanstack/react-table`.
    -   Props: `columns`, `data`, `isLoading`, `onRowClick`.
    -   Features: Sorting, filtering (via external controls), pagination, responsive handling.
-   **`OrderDetailView`**: Read-only display of a finalized/validated order for Admin/Radiology views.
    -   Props: `orderData`.
    *   Organizes order details into clear sections (Patient Info, Insurance, Clinical Summary, Validation Result, Codes, History). Uses Shadcn `Card`.
-   **`Badge` / `Tag`**: Small visual indicator (from Shadcn/ui) for status, priority, etc.
-   **`Dialog`**: Standard modal dialog component (from Shadcn/ui). Used for `OverrideDialog` and `PatientIdentificationDictation`.
-   **`Spinner` / `LoadingIndicator`**: Visual indicator (`Loader2` icon from lucide-react) for loading states, often within buttons.
-   **`Toast`**: Small, non-blocking notifications (from Shadcn/ui). Used for success/error messages.
-   **`ClinicalContextPanel`**: Slide-out or modal panel showing related patient clinical history (imaging, labs, etc.). Uses Shadcn `Card`, `Tabs`.

## 4. Specific Components from Implementation

-   **`InitialPatientIdentifier`**: Step 1 component before patient is known. Uses `Input`, `Select`, `Button`. (May be replaced by `PatientInfoCard` + `PatientIdentificationDictation` combo).
-   **`DictationForm`**: Step 1 component for dictation input and showing feedback requiring clarification. Uses `Textarea`, `Button`, `Badge`.
-   **`OverrideDialog`**: Modal dialog for capturing override justification. Uses Shadcn `Dialog`, `Textarea`, `Button`.
-   **`SignatureForm`**: Step 3 component for drawing signature and confirming name. Uses `canvas`, `Input`, `Button`.
-   **`PatientIdentificationDictation`**: Modal dialog for capturing patient name/DOB via voice or text. Uses Shadcn `Dialog`, `Input`, `Button`.

---

**Note:** This list defines core components. Specific implementations rely heavily on Shadcn/ui primitives (`Card`, `Button`, `Input`, `Textarea`, `Badge`, `Dialog`, `Select`, `Toast`) combined with custom logic and layout using Tailwind CSS. Consistency in naming, props, and styling is key.
