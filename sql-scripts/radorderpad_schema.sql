-- RadOrderPad Database Schema
-- Version: 1.0
-- Date: 2025-04-13
--
-- This script creates two separate PostgreSQL databases for the RadOrderPad application:
-- 1. radorder_main: Non-PHI database for system configuration, user accounts, etc.
-- 2. radorder_phi: PHI database for patient information, orders, etc.
--
-- IMPORTANT: This script implements the two-database architecture required for HIPAA compliance.
-- Foreign key constraints are ONLY implemented within each database, not between databases.
-- Relationships between databases are logical and enforced by the application layer.

-- Create the radorder_main database (Non-PHI)
CREATE DATABASE radorder_main;

-- Connect to the radorder_main database
\c radorder_main;

-- Create tables for radorder_main database

-- Table: organizations
-- Description: Referring/Radiology Groups
CREATE TABLE organizations (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- 'referring_practice', 'radiology_group'
    npi TEXT,
    tax_id TEXT,
    address_line1 TEXT,
    address_line2 TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    phone_number TEXT,
    fax_number TEXT,
    contact_email TEXT,
    website TEXT,
    logo_url TEXT,
    billing_id TEXT, -- Stripe customer ID
    credit_balance INTEGER NOT NULL DEFAULT 0, -- Current validation credit balance
    subscription_tier TEXT, -- e.g., 'tier_1', 'tier_2' (for referring groups)
    status TEXT NOT NULL DEFAULT 'active', -- 'active', 'on_hold', 'purgatory', 'terminated'
    assigned_account_manager_id INTEGER, -- User ID of internal account manager (FK added later)
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

-- Table: locations
-- Description: Org Facilities/Sites
CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL REFERENCES organizations(id),
    name TEXT NOT NULL, -- Location name (e.g., "Downtown Clinic")
    address_line1 TEXT,
    address_line2 TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    phone_number TEXT, -- Location specific phone
    is_active BOOLEAN NOT NULL DEFAULT true, -- Whether the location is active
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

-- Table: users
-- Description: System Users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL REFERENCES organizations(id), -- ID of the organization the user belongs to
    primary_location_id INTEGER REFERENCES locations(id), -- Primary location assignment (alternative to user_locations)
    email TEXT NOT NULL UNIQUE, -- User email address (used for login)
    password_hash TEXT, -- Hashed user password
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    role TEXT NOT NULL, -- User role ('admin_referring', 'admin_radiology', 'physician', 'admin_staff', 'radiologist', 'scheduler', 'super_admin')
    npi TEXT, -- National Provider Identifier for healthcare providers
    signature_url TEXT, -- URL to the user's electronic signature image (optional)
    is_active BOOLEAN NOT NULL DEFAULT true, -- Whether the user account is active
    last_login TIMESTAMP WITHOUT TIME ZONE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    email_verified BOOLEAN NOT NULL DEFAULT false, -- Whether the user's email address has been verified
    specialty TEXT, -- Medical specialty of the user (for physicians and radiologists)
    invitation_token TEXT, -- Token for user invitation process
    invitation_sent_at TIMESTAMP WITHOUT TIME ZONE,
    invitation_accepted_at TIMESTAMP WITHOUT TIME ZONE,
    phone_number TEXT -- User contact phone number
);

-- Now that users table is created, we can add the foreign key to organizations
ALTER TABLE organizations 
ADD CONSTRAINT fk_organizations_account_manager 
FOREIGN KEY (assigned_account_manager_id) REFERENCES users(id);

-- Table: user_locations
-- Description: User<->Location Link
CREATE TABLE user_locations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    location_id INTEGER NOT NULL REFERENCES locations(id),
    UNIQUE (user_id, location_id) -- Ensure unique assignment
);

-- Table: organization_relationships
-- Description: Links between Orgs
CREATE TABLE organization_relationships (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL REFERENCES organizations(id), -- ID of the organization initiating the relationship
    related_organization_id INTEGER NOT NULL REFERENCES organizations(id), -- ID of the target organization
    status TEXT NOT NULL DEFAULT 'pending', -- Status ('pending', 'active', 'rejected', 'purgatory', 'terminated')
    initiated_by_id INTEGER REFERENCES users(id), -- User ID who initiated the relationship
    approved_by_id INTEGER REFERENCES users(id), -- User ID who approved/rejected the relationship
    notes TEXT, -- Notes about the relationship
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    UNIQUE (organization_id, related_organization_id) -- Ensure only one relationship pair exists
);

-- Table: sessions
-- Description: User Sessions
CREATE TABLE sessions (
    id TEXT PRIMARY KEY, -- Session ID (e.g., UUID)
    user_id INTEGER REFERENCES users(id), -- Associated user
    expires_at TIMESTAMP WITHOUT TIME ZONE NOT NULL, -- Session expiry time
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now() -- Timestamp created
);

-- Table: refresh_tokens
-- Description: Auth Refresh Tokens
CREATE TABLE refresh_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id), -- Associated user
    token TEXT NOT NULL UNIQUE, -- The refresh token value
    token_id TEXT NOT NULL UNIQUE, -- Identifier for the token family
    expires_at TIMESTAMP WITHOUT TIME ZONE NOT NULL, -- Token expiry time
    issued_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(), -- Timestamp issued
    is_revoked BOOLEAN NOT NULL DEFAULT false, -- If the token has been revoked
    ip_address TEXT, -- IP address of issuance
    user_agent TEXT, -- User agent of issuance
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now() -- Timestamp created
);

-- Table: password_reset_tokens
-- Description: Password Reset
CREATE TABLE password_reset_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id), -- Associated user
    token TEXT NOT NULL UNIQUE, -- The reset token value
    expires_at TIMESTAMP WITHOUT TIME ZONE NOT NULL, -- Token expiry time
    used BOOLEAN NOT NULL DEFAULT false, -- If the token was used
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now() -- Timestamp created
);

-- Table: email_verification_tokens
-- Description: Email Verification
CREATE TABLE email_verification_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id), -- Associated user
    token TEXT NOT NULL UNIQUE, -- The verification token value
    expires_at TIMESTAMP WITHOUT TIME ZONE NOT NULL, -- Token expiry time
    used BOOLEAN NOT NULL DEFAULT false, -- If the token was used
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now() -- Timestamp created
);

-- Table: user_invitations
-- Description: Bulk User Invites
CREATE TABLE user_invitations (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL REFERENCES organizations(id), -- Target organization
    invited_by_user_id INTEGER REFERENCES users(id), -- User who sent the invitation
    email TEXT NOT NULL, -- Email address invited
    role TEXT NOT NULL, -- Role assigned
    token TEXT NOT NULL UNIQUE, -- Invitation token value
    expires_at TIMESTAMP WITHOUT TIME ZONE NOT NULL, -- Token expiry time
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'accepted', etc.
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

-- Table: medical_cpt_codes
-- Description: CPT Master
CREATE TABLE medical_cpt_codes (
    cpt_code TEXT PRIMARY KEY, -- CPT code identifier
    description TEXT, -- Human-readable description of the procedure
    allergy_considerations TEXT,
    alternatives TEXT,
    body_part TEXT, -- Body part targeted by this procedure
    category TEXT,
    complexity TEXT,
    contraindications TEXT,
    contrast_use TEXT, -- Whether contrast is typically used
    equipment_needed TEXT,
    imaging_protocol TEXT,
    laterality TEXT, -- Whether the procedure is performed on a specific side
    mobility_considerations TEXT,
    modality TEXT, -- Imaging modality (MRI, CT, X-Ray, etc.)
    notes TEXT,
    patient_preparation TEXT, -- Instructions for patient preparation
    pediatrics TEXT,
    post_procedure_care TEXT,
    procedure_duration TEXT,
    radiotracer TEXT,
    regulatory_notes TEXT,
    relative_radiation_level TEXT,
    sedation TEXT,
    special_populations TEXT,
    typical_dose TEXT,
    typical_findings TEXT,
    imported_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP, -- Timestamp when this code was imported
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP -- Timestamp when this code was last updated
);

-- Table: medical_icd10_codes
-- Description: ICD-10 Master
CREATE TABLE medical_icd10_codes (
    icd10_code TEXT PRIMARY KEY, -- ICD-10 code identifier
    description TEXT, -- Human-readable description of the diagnosis
    associated_symptom_clusters TEXT,
    block TEXT,
    block_description TEXT,
    category TEXT,
    chapter TEXT,
    clinical_notes TEXT, -- Clinical information about this diagnosis
    contraindications TEXT,
    follow_up_recommendations TEXT,
    imaging_modalities TEXT, -- Recommended imaging modalities for this diagnosis
    inappropriate_imaging_risk INTEGER,
    is_billable BOOLEAN,
    keywords TEXT,
    parent_code TEXT,
    primary_imaging TEXT,
    priority TEXT, -- Clinical priority level for this diagnosis
    secondary_imaging TEXT,
    typical_misdiagnosis_codes TEXT,
    imported_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP, -- Timestamp when this code was imported
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP -- Timestamp when this code was last updated
);

-- Table: medical_cpt_icd10_mappings
-- Description: ICD-CPT Appropriateness
CREATE TABLE medical_cpt_icd10_mappings (
    id SERIAL PRIMARY KEY, -- Primary key for the mapping
    icd10_code TEXT REFERENCES medical_icd10_codes(icd10_code), -- Reference to ICD-10 code
    cpt_code TEXT REFERENCES medical_cpt_codes(cpt_code), -- Reference to CPT code
    appropriateness INTEGER, -- Appropriateness score (e.g., 1-9 from ACR)
    evidence_level TEXT, -- Level of evidence supporting this pairing
    evidence_source TEXT, -- Source of evidence for this pairing (e.g., ACR)
    evidence_id TEXT, -- Specific ID within the evidence source
    enhanced_notes TEXT, -- Additional notes/context for the mapping
    refined_justification TEXT, -- Specific justification for the appropriateness score
    guideline_version TEXT, -- Version of the guideline used
    last_updated DATE, -- Date guideline was last checked/updated
    imported_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP, -- Timestamp when this mapping was imported
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP -- Timestamp when this mapping was last updated
);

-- Table: medical_icd10_markdown_docs
-- Description: ICD-10 Rich Docs
CREATE TABLE medical_icd10_markdown_docs (
    id SERIAL PRIMARY KEY, -- Primary key for the markdown document
    icd10_code TEXT NOT NULL UNIQUE REFERENCES medical_icd10_codes(icd10_code), -- Reference to the ICD-10 code
    content TEXT, -- Markdown content with detailed information about the diagnosis
    file_path TEXT, -- Path to source markdown file if applicable
    import_date TIMESTAMP WITHOUT TIME ZONE -- Date when this document was imported
);

-- Table: prompt_templates
-- Description: Validation Prompts
CREATE TABLE prompt_templates (
    id SERIAL PRIMARY KEY, -- Unique identifier for the prompt template
    name TEXT NOT NULL, -- Descriptive name (e.g., "Default Validation v2", "Rare Disease Feedback")
    type TEXT NOT NULL, -- Category ('default', 'rare_disease', 'low_confidence', etc.)
    version TEXT NOT NULL, -- Version identifier (e.g., "1.0", "2025-Q2", "beta")
    content_template TEXT NOT NULL, -- The actual prompt text, using placeholders like {{PLACEHOLDER}}
    word_limit INTEGER, -- Optional target word count for the LLM's feedback section
    active BOOLEAN NOT NULL DEFAULT true, -- Whether this template is currently active/usable
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

-- Table: prompt_assignments
-- Description: A/B Testing Prompts
CREATE TABLE prompt_assignments (
    id SERIAL PRIMARY KEY, -- Unique identifier for the assignment
    physician_id INTEGER NOT NULL REFERENCES users(id), -- The user (physician) this assignment applies to
    prompt_id INTEGER NOT NULL REFERENCES prompt_templates(id), -- The specific prompt template assigned
    ab_group TEXT, -- Identifier for the A/B test group (e.g., 'A', 'B', 'Control')
    assigned_on TIMESTAMP WITHOUT TIME ZONE DEFAULT now(), -- Timestamp when the assignment was made or became active
    is_active BOOLEAN NOT NULL DEFAULT true -- Whether this specific assignment is currently active
);

-- Table: llm_validation_logs
-- Description: LLM Call Metadata
CREATE TABLE llm_validation_logs (
    id BIGSERIAL PRIMARY KEY, -- Primary key (bigint for potentially high volume)
    order_id INTEGER NOT NULL, -- Logical FK to radorder_phi.orders.id
    validation_attempt_id INTEGER NOT NULL, -- Logical FK to radorder_phi.validation_attempts.id
    user_id INTEGER NOT NULL REFERENCES users(id), -- User initiating the validation
    organization_id INTEGER NOT NULL REFERENCES organizations(id), -- User's organization
    llm_provider TEXT NOT NULL, -- 'anthropic', 'xai', 'openai'
    model_name TEXT NOT NULL, -- Specific model used (e.g., 'claude-3-7-sonnet-20250219')
    prompt_template_id INTEGER REFERENCES prompt_templates(id), -- Prompt template used (if applicable)
    prompt_tokens INTEGER, -- Input tokens used
    completion_tokens INTEGER, -- Output tokens generated
    total_tokens INTEGER, -- Total tokens for the call
    latency_ms INTEGER, -- API call latency in milliseconds
    status TEXT NOT NULL, -- 'success', 'failed', 'fallback_success (...)', 'fallback_failed (...)'
    error_message TEXT, -- Error details if failed
    raw_response_digest TEXT, -- Hash/digest of raw response for debugging (optional, non-PHI)
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now() -- Timestamp of the LLM call attempt
);

-- Table: billing_events
-- Description: Stripe/Manual Billing
CREATE TABLE billing_events (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL REFERENCES organizations(id), -- Organization related to the event
    event_type TEXT NOT NULL, -- 'charge', 'subscription_payment', 'top_up', 'credit_grant', 'manual_adjustment', 'payment_failed'
    amount_cents INTEGER, -- Amount in cents (positive or negative for adjustments)
    currency TEXT NOT NULL DEFAULT 'usd', -- Currency code
    payment_method_type TEXT, -- e.g., 'card', 'ach'
    stripe_event_id TEXT, -- ID from Stripe event (if applicable)
    stripe_invoice_id TEXT, -- ID from Stripe invoice (if applicable)
    stripe_charge_id TEXT, -- ID from Stripe charge (if applicable)
    description TEXT, -- Human-readable description
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now() -- Timestamp of the billing event
);

-- Table: credit_usage_logs
-- Description: Validation Credit Usage
CREATE TABLE credit_usage_logs (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL REFERENCES organizations(id), -- Organization consuming the credit
    user_id INTEGER NOT NULL REFERENCES users(id), -- User performing the action
    order_id INTEGER NOT NULL, -- Logical FK to radorder_phi.orders.id
    validation_attempt_id INTEGER, -- Logical FK to radorder_phi.validation_attempts.id (Optional)
    tokens_burned INTEGER NOT NULL DEFAULT 1, -- Number of credits consumed
    action_type TEXT NOT NULL, -- 'validate', 'clarify', 'override_validate'
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now() -- Timestamp of credit consumption
);

-- Table: purgatory_events
-- Description: Org Suspension Log
CREATE TABLE purgatory_events (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL REFERENCES organizations(id), -- Organization affected
    reason TEXT NOT NULL, -- Reason for entering purgatory (e.g., 'payment_failed')
    triggered_by TEXT, -- Source ('stripe_webhook', 'super_admin')
    triggered_by_id INTEGER REFERENCES users(id), -- Super admin user ID if manually triggered
    status TEXT NOT NULL DEFAULT 'active', -- Status of the purgatory event ('active', 'resolved')
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(), -- Timestamp when purgatory started
    resolved_at TIMESTAMP WITHOUT TIME ZONE -- Timestamp when resolved
);

-- Create the radorder_phi database (PHI)
CREATE DATABASE radorder_phi;

-- Connect to the radorder_phi database
\c radorder_phi;

-- Create tables for radorder_phi database

-- Table: patients
-- Description: Patient Demographics
CREATE TABLE patients (
    id SERIAL PRIMARY KEY, -- Internal primary key for the patient
    pidn TEXT UNIQUE, -- Platform-internal unique patient ID
    organization_id INTEGER NOT NULL, -- Logical FK to radorder_main.organizations.id
    mrn TEXT, -- External Medical Record Number (optional)
    first_name TEXT NOT NULL, -- Patient first name
    last_name TEXT NOT NULL, -- Patient last name
    middle_name TEXT, -- Patient middle name
    date_of_birth TEXT NOT NULL, -- Patient date of birth (e.g., YYYY-MM-DD)
    gender TEXT NOT NULL, -- Patient gender (e.g., 'Male', 'Female', 'Other')
    address_line1 TEXT, -- Patient address line 1
    address_line2 TEXT, -- Patient address line 2
    city TEXT, -- Patient city
    state TEXT, -- Patient state/province
    zip_code TEXT, -- Patient ZIP/postal code
    phone_number TEXT, -- Patient contact phone number
    email TEXT, -- Patient contact email
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP, -- Timestamp when patient record was created
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP -- Timestamp when patient record was last updated
);

-- Table: patient_insurance
-- Description: Patient Insurance
CREATE TABLE patient_insurance (
    id SERIAL PRIMARY KEY, -- Primary key for the insurance record
    patient_id INTEGER NOT NULL REFERENCES patients(id), -- Link to the patient record
    is_primary BOOLEAN DEFAULT false, -- Indicates if this is the primary insurance
    insurer_name TEXT NOT NULL, -- Name of the insurance company
    policy_number TEXT NOT NULL, -- Insurance policy number
    group_number TEXT, -- Insurance group number
    plan_type TEXT, -- Type of insurance plan (e.g., PPO, HMO)
    policy_holder_name TEXT, -- Name of the policy holder if not the patient
    policy_holder_relationship TEXT, -- Relationship of policy holder to patient
    policy_holder_date_of_birth TEXT, -- DOB of the policy holder
    verification_status TEXT DEFAULT 'not_verified', -- Status of insurance verification
    verification_date TIMESTAMP WITHOUT TIME ZONE, -- Timestamp when insurance was last verified
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP, -- Timestamp when insurance record was created
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP -- Timestamp when insurance record was last updated
);

-- Table: orders
-- Description: Radiology Orders
CREATE TABLE orders (
    id SERIAL PRIMARY KEY, -- Primary key for the order
    order_number TEXT NOT NULL UNIQUE, -- Unique identifier for the order within the platform
    patient_id INTEGER NOT NULL REFERENCES patients(id), -- Link to the patient
    referring_organization_id INTEGER NOT NULL, -- Logical FK to radorder_main.organizations.id
    radiology_organization_id INTEGER NOT NULL, -- Logical FK to radorder_main.organizations.id
    originating_location_id INTEGER, -- Logical FK to radorder_main.locations.id (Referring Location)
    target_facility_id INTEGER, -- Logical FK to radorder_main.locations.id (Target Radiology Loc)
    created_by_user_id INTEGER NOT NULL, -- Logical FK to radorder_main.users.id (Physician/MA)
    signed_by_user_id INTEGER, -- Logical FK to radorder_main.users.id (Physician who signed)
    updated_by_user_id INTEGER, -- Logical FK to radorder_main.users.id (Last user to update)
    status TEXT NOT NULL DEFAULT 'draft', -- Order status ('draft', 'pending_validation', 'pending_admin', 'pending_radiology', 'override_pending_signature', 'scheduled', 'completed', 'cancelled', 'results_available', 'results_acknowledged')
    priority TEXT NOT NULL DEFAULT 'routine', -- Order priority ('routine', 'stat')
    original_dictation TEXT, -- Initial dictation text from the physician
    clinical_indication TEXT, -- Final/parsed clinical indication text
    modality TEXT, -- Requested imaging modality (e.g., MRI, CT)
    body_part TEXT, -- Target body part
    laterality TEXT, -- 'Left', 'Right', 'Bilateral', 'None'
    final_cpt_code TEXT, -- Final suggested/validated CPT code stored on the order
    final_cpt_code_description TEXT, -- Description of the final CPT code
    final_icd10_codes TEXT, -- Final suggested/validated ICD-10 codes (comma-separated?)
    final_icd10_code_descriptions TEXT, -- Descriptions of the final ICD-10 codes
    is_contrast_indicated BOOLEAN, -- Whether contrast is indicated
    patient_pregnant TEXT, -- Patient pregnancy status ('Yes', 'No', 'Unknown')
    patient_pregnancy_notes TEXT, -- Notes related to pregnancy
    authorization_number TEXT, -- Pre-authorization number if obtained
    authorization_status TEXT, -- Status of pre-authorization
    authorization_date TIMESTAMP WITHOUT TIME ZONE, -- Date pre-authorization was obtained
    signature_date TIMESTAMP WITHOUT TIME ZONE, -- Timestamp when the order was digitally signed
    scheduled_date TIMESTAMP WITHOUT TIME ZONE, -- Date/time the exam is scheduled
    pdf_url TEXT, -- Link to a generated PDF summary of the order (optional)
    patient_name TEXT, -- Cached patient name for display
    patient_dob TEXT, -- Cached patient DOB for display
    patient_gender TEXT, -- Cached patient gender for display
    patient_mrn TEXT, -- Cached patient MRN for display
    insurance_provider TEXT, -- Cached primary insurance provider for display
    insurance_policy_number TEXT, -- Cached primary policy number for display
    contrast TEXT, -- Specific contrast agent details if applicable
    special_instructions TEXT, -- Special instructions for the radiology team
    prep_instructions TEXT, -- Patient preparation instructions
    final_validation_status TEXT, -- Final validation status ('appropriate', 'inappropriate', 'override')
    final_compliance_score INTEGER, -- Final compliance score (e.g., 1-9)
    final_validation_notes TEXT, -- Final feedback/notes from validation
    validated_at TIMESTAMP WITHOUT TIME ZONE, -- Timestamp of the final validation/override
    referring_physician_name TEXT, -- Cached referring physician name
    referring_physician_npi TEXT, -- Cached referring physician NPI
    radiology_organization_name TEXT, -- Cached name of the target radiology group
    auc_outcome TEXT, -- Appropriate Use Criteria outcome code/description
    guideline_source TEXT, -- Source of the AUC guideline used (e.g., ACR Select)
    override_justification TEXT, -- Physician's justification text for overriding validation
    overridden BOOLEAN NOT NULL DEFAULT false, -- Flag indicating if physician overrode validation recommendation
    is_urgent_override BOOLEAN DEFAULT false, -- Flag if override was due to urgency
    final_report_text TEXT, -- Pasted text of the final report (Result Return Loop)
    results_acknowledged_at TIMESTAMP WITHOUT TIME ZONE, -- Timestamp when referring user acknowledged results
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP, -- Timestamp when order was initially created
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP -- Timestamp when order was last updated
);

-- Table: validation_attempts
-- Description: Per-Pass Validation Log
CREATE TABLE validation_attempts (
    id SERIAL PRIMARY KEY, -- Primary key for the validation attempt
    order_id INTEGER NOT NULL REFERENCES orders(id), -- Link to the order being validated
    attempt_number INTEGER NOT NULL, -- Sequence number of the attempt (1, 2, 3)
    validation_input_text TEXT NOT NULL, -- The full dictation text submitted for this attempt
    validation_outcome TEXT NOT NULL, -- Result status ('appropriate', 'needs_clarification', 'inappropriate')
    generated_icd10_codes TEXT, -- ICD-10 codes suggested by LLM for this attempt
    generated_cpt_codes TEXT, -- CPT codes suggested by LLM for this attempt
    generated_feedback_text TEXT, -- Feedback text generated for this attempt
    generated_compliance_score INTEGER, -- Compliance score generated for this attempt
    is_rare_disease_feedback BOOLEAN NOT NULL DEFAULT false, -- Flag indicating if rare disease logic modified feedback
    llm_validation_log_id BIGINT, -- NULLABLE. Logical FK to radorder_main.llm_validation_logs.id
    user_id INTEGER NOT NULL, -- Logical FK to radorder_main.users.id (User who submitted)
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP -- Timestamp of this validation attempt
);

-- Table: order_history
-- Description: Order Audit Trail
CREATE TABLE order_history (
    id SERIAL PRIMARY KEY, -- Primary key for the history event
    order_id INTEGER NOT NULL REFERENCES orders(id), -- Link to the order
    user_id INTEGER, -- Logical FK to radorder_main.users.id (User action)
    event_type TEXT NOT NULL, -- Type of event ('created', 'validated', 'signed', 'admin_finalized', 'sent_to_radiology', 'scheduled', 'completed', 'cancelled', 'results_added', 'results_acknowledged', 'override', 'clarification_added')
    previous_status TEXT, -- Order status before the event
    new_status TEXT, -- Order status after the event
    details TEXT, -- Additional details about the event (e.g., override reason snippet, validation attempt #)
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP -- Timestamp of the event
);

-- Table: order_notes
-- Description: Notes on Orders
CREATE TABLE order_notes (
    id SERIAL PRIMARY KEY, -- Primary key for the note
    order_id INTEGER NOT NULL REFERENCES orders(id), -- Link to the order
    user_id INTEGER NOT NULL, -- Logical FK to radorder_main.users.id
    note_type TEXT NOT NULL, -- Type of note (e.g., 'internal', 'clinical', 'scheduling')
    note_text TEXT NOT NULL, -- The content of the note
    is_internal BOOLEAN DEFAULT false, -- If the note is for internal staff only
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP, -- Timestamp note created
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP -- Timestamp note updated
);

-- Table: document_uploads
-- Description: Uploaded Files (S3 Links)
CREATE TABLE document_uploads (
    id SERIAL PRIMARY KEY, -- Primary key for the upload record
    user_id INTEGER NOT NULL, -- Logical FK to radorder_main.users.id (Uploader)
    order_id INTEGER REFERENCES orders(id), -- Link to order if applicable
    patient_id INTEGER REFERENCES patients(id), -- Link to patient if applicable
    document_type TEXT NOT NULL, -- User-defined or system type ('insurance_card', 'lab_report', 'signature', 'prior_imaging', 'supplemental', 'final_report')
    filename TEXT NOT NULL, -- Original filename provided by the user
    file_path TEXT NOT NULL UNIQUE, -- The full key/path of the object in the S3 bucket
    file_size INTEGER NOT NULL, -- File size in bytes
    mime_type TEXT, -- File MIME type (e.g., 'image/png', 'application/pdf')
    processing_status TEXT DEFAULT 'uploaded', -- Status ('uploaded', 'processing', 'processed', 'failed')
    processing_details TEXT, -- Notes from any post-upload processing (e.g., OCR)
    content_extracted TEXT, -- Extracted text content (optional)
    uploaded_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP -- Timestamp of successful upload confirmation
);

-- Table: patient_clinical_records
-- Description: Pasted EMR/Clinical Data
CREATE TABLE patient_clinical_records (
    id SERIAL PRIMARY KEY, -- Primary key
    patient_id INTEGER NOT NULL REFERENCES patients(id), -- Link to the patient
    order_id INTEGER REFERENCES orders(id), -- Link to order if associated with a specific order
    record_type TEXT NOT NULL, -- Type ('emr_summary_paste', 'supplemental_docs_paste', 'lab', 'medication', 'diagnosis', 'prior_imaging_report')
    content TEXT NOT NULL, -- Raw pasted text content or structured data
    parsed_data JSONB, -- Structured data extracted from content (optional)
    source_system TEXT, -- EMR source if known (e.g., 'Athena', 'eCW', 'Manual')
    record_date DATE, -- Date associated with the record (e.g., lab date)
    added_by_user_id INTEGER NOT NULL, -- Logical FK to radorder_main.users.id (User who added)
    added_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP, -- Timestamp when record was added
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP -- Timestamp when record was updated
);

-- Table: information_requests
-- Description: Requests for Missing Info
CREATE TABLE information_requests (
    id SERIAL PRIMARY KEY, -- Primary key
    order_id INTEGER NOT NULL REFERENCES orders(id), -- Link to the order requiring info
    requested_by_user_id INTEGER NOT NULL, -- Logical FK to radorder_main.users.id (User requesting)
    requesting_organization_id INTEGER NOT NULL, -- Logical FK to radorder_main.organizations.id (Org requesting)
    target_organization_id INTEGER NOT NULL, -- Logical FK to radorder_main.organizations.id (Org to provide info)
    requested_info_type TEXT NOT NULL, -- Type of info needed (e.g., 'labs', 'prior_imaging', 'clarification')
    requested_info_details TEXT NOT NULL, -- Specific details of the request
    status TEXT NOT NULL DEFAULT 'pending', -- Status ('pending', 'fulfilled', 'cancelled')
    requested_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP, -- Timestamp when request was made
    fulfilled_at TIMESTAMP WITHOUT TIME ZONE, -- Timestamp when info was provided
    fulfilled_by_record_id INTEGER REFERENCES patient_clinical_records(id), -- Link to patient_clinical_records providing the info
    fulfilled_by_document_id INTEGER REFERENCES document_uploads(id), -- Link to document_uploads providing the info
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP, -- Timestamp record created
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP -- Timestamp record updated
);

-- End of RadOrderPad Database Schema
