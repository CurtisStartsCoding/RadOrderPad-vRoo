/**
 * RadOrderPad E2E Test Database
 * 
 * This file contains structured test data that can be used consistently across all tests.
 * It provides a database-like structure for organizations, users, orders, connections, etc.
 */

// Organizations database
const organizations = {
  // Referring organizations
  referring_a: {
    id: 'org_ref_a',
    name: 'Test Referring Practice A',
    type: 'referring',
    address: '123 Main St',
    city: 'Anytown',
    state: 'CA',
    zipCode: '90210',
    phoneNumber: '555-123-4567',
    createdAt: '2025-01-15T10:00:00.000Z'
  },
  referring_b: {
    id: 'org_ref_b',
    name: 'Test Referring Practice B',
    type: 'referring',
    address: '456 Oak Ave',
    city: 'Somewhere',
    state: 'NY',
    zipCode: '10001',
    phoneNumber: '555-234-5678',
    createdAt: '2025-01-16T11:00:00.000Z'
  },
  referring_c: {
    id: 'org_ref_c',
    name: 'Test Referring Practice C',
    type: 'referring',
    address: '789 Pine St',
    city: 'Elsewhere',
    state: 'TX',
    zipCode: '75001',
    phoneNumber: '555-345-6789',
    createdAt: '2025-01-17T12:00:00.000Z'
  },
  
  // Radiology organizations
  radiology_a: {
    id: 'org_rad_a',
    name: 'Test Radiology Center A',
    type: 'radiology',
    address: '100 Medical Pkwy',
    city: 'Anytown',
    state: 'CA',
    zipCode: '90211',
    phoneNumber: '555-987-6543',
    createdAt: '2025-01-15T09:00:00.000Z'
  },
  radiology_b: {
    id: 'org_rad_b',
    name: 'Test Radiology Center B',
    type: 'radiology',
    address: '200 Hospital Dr',
    city: 'Somewhere',
    state: 'NY',
    zipCode: '10002',
    phoneNumber: '555-876-5432',
    createdAt: '2025-01-16T10:00:00.000Z'
  },
  radiology_c: {
    id: 'org_rad_c',
    name: 'Test Radiology Center C',
    type: 'radiology',
    address: '300 Imaging Blvd',
    city: 'Elsewhere',
    state: 'TX',
    zipCode: '75002',
    phoneNumber: '555-765-4321',
    createdAt: '2025-01-17T11:00:00.000Z'
  }
};

// Users database
const users = {
  // Referring admins
  admin_ref_a: {
    id: 'user_admin_ref_a',
    firstName: 'John',
    lastName: 'Smith',
    email: 'admin-ref-a@example.com',
    password: 'Password123!',
    role: 'admin',
    organizationId: 'org_ref_a',
    createdAt: '2025-01-15T10:05:00.000Z'
  },
  admin_ref_b: {
    id: 'user_admin_ref_b',
    firstName: 'Robert',
    lastName: 'Johnson',
    email: 'admin-ref-b@example.com',
    password: 'Password123!',
    role: 'admin',
    organizationId: 'org_ref_b',
    createdAt: '2025-01-16T11:05:00.000Z'
  },
  admin_ref_c: {
    id: 'user_admin_ref_c',
    firstName: 'Michael',
    lastName: 'Williams',
    email: 'admin-ref-c@example.com',
    password: 'Password123!',
    role: 'admin',
    organizationId: 'org_ref_c',
    createdAt: '2025-01-17T12:05:00.000Z'
  },
  
  // Radiology admins
  admin_rad_a: {
    id: 'user_admin_rad_a',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'admin-rad-a@example.com',
    password: 'Password123!',
    role: 'admin',
    organizationId: 'org_rad_a',
    createdAt: '2025-01-15T09:05:00.000Z'
  },
  admin_rad_b: {
    id: 'user_admin_rad_b',
    firstName: 'Emily',
    lastName: 'Brown',
    email: 'admin-rad-b@example.com',
    password: 'Password123!',
    role: 'admin',
    organizationId: 'org_rad_b',
    createdAt: '2025-01-16T10:05:00.000Z'
  },
  admin_rad_c: {
    id: 'user_admin_rad_c',
    firstName: 'Jessica',
    lastName: 'Davis',
    email: 'admin-rad-c@example.com',
    password: 'Password123!',
    role: 'admin',
    organizationId: 'org_rad_c',
    createdAt: '2025-01-17T11:05:00.000Z'
  },
  
  // Physicians
  physician_a: {
    id: 'user_physician_a',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'physician-a@example.com',
    password: 'Password123!',
    role: 'physician',
    npi: '1234567890',
    organizationId: 'org_ref_a',
    createdAt: '2025-01-15T10:10:00.000Z'
  },
  physician_b: {
    id: 'user_physician_b',
    firstName: 'Emily',
    lastName: 'Davis',
    email: 'physician-b@example.com',
    password: 'Password123!',
    role: 'physician',
    npi: '2345678901',
    organizationId: 'org_ref_b',
    createdAt: '2025-01-16T11:10:00.000Z'
  },
  physician_c: {
    id: 'user_physician_c',
    firstName: 'David',
    lastName: 'Wilson',
    email: 'physician-c@example.com',
    password: 'Password123!',
    role: 'physician',
    npi: '3456789012',
    organizationId: 'org_ref_c',
    createdAt: '2025-01-17T12:10:00.000Z'
  },
  
  // Schedulers
  scheduler_a: {
    id: 'user_scheduler_a',
    firstName: 'Mary',
    lastName: 'Johnson',
    email: 'scheduler-a@example.com',
    password: 'Password123!',
    role: 'scheduler',
    organizationId: 'org_rad_a',
    createdAt: '2025-01-15T09:10:00.000Z'
  },
  scheduler_b: {
    id: 'user_scheduler_b',
    firstName: 'James',
    lastName: 'Brown',
    email: 'scheduler-b@example.com',
    password: 'Password123!',
    role: 'scheduler',
    organizationId: 'org_rad_b',
    createdAt: '2025-01-16T10:10:00.000Z'
  },
  scheduler_c: {
    id: 'user_scheduler_c',
    firstName: 'Patricia',
    lastName: 'Davis',
    email: 'scheduler-c@example.com',
    password: 'Password123!',
    role: 'scheduler',
    organizationId: 'org_rad_c',
    createdAt: '2025-01-17T11:10:00.000Z'
  }
};

// Patients database
const patients = {
  patient_a: {
    firstName: 'Robert',
    lastName: 'Johnson',
    dateOfBirth: '1950-05-15',
    gender: 'male',
    mrn: 'MRN12345A',
    insurance: 'Medicare',
    policyNumber: '123456789A',
    groupNumber: 'MCARE2023'
  },
  patient_b: {
    firstName: 'Susan',
    lastName: 'Williams',
    dateOfBirth: '1965-08-22',
    gender: 'female',
    mrn: 'MRN67890B',
    insurance: 'Blue Cross',
    policyNumber: 'BC987654321',
    groupNumber: 'BCBS2023'
  },
  patient_c: {
    firstName: 'Thomas',
    lastName: 'Brown',
    dateOfBirth: '1978-11-30',
    gender: 'male',
    mrn: 'MRN54321C',
    insurance: 'Aetna',
    policyNumber: 'AET123456789',
    groupNumber: 'AETNA2023'
  }
};

// Test dictations with expected CPT and ICD-10 codes
const dictations = {
  lumbar_mri: {
    text: '72-year-old male with persistent lower back pain radiating to left leg for 3 months. Pain worsens with activity. Patient has history of lumbar disc herniation. Physical exam shows positive straight leg raise on left. Request MRI lumbar spine without contrast to evaluate for disc herniation or spinal stenosis.',
    expectedCptCode: '72148',
    expectedCptDescription: 'MRI lumbar spine without contrast',
    expectedIcd10Codes: ['M54.5', 'M51.36'],
    expectedIcd10Descriptions: ['Low back pain', 'Other intervertebral disc degeneration, lumbar region']
  },
  brain_ct: {
    text: '45-year-old female with sudden onset severe headache, nausea, and photophobia for past 6 hours. No history of migraines. No focal neurological deficits on exam. Request CT head without contrast to rule out subarachnoid hemorrhage.',
    expectedCptCode: '70450',
    expectedCptDescription: 'CT head without contrast',
    expectedIcd10Codes: ['R51.9', 'R11.0'],
    expectedIcd10Descriptions: ['Headache, unspecified', 'Nausea with vomiting']
  },
  shoulder_xray: {
    text: '35-year-old male with right shoulder pain after fall during basketball game yesterday. Limited range of motion and tenderness over acromioclavicular joint. Request X-ray right shoulder to evaluate for fracture or dislocation.',
    expectedCptCode: '73030',
    expectedCptDescription: 'X-ray shoulder complete',
    expectedIcd10Codes: ['S43.401A', 'M25.511'],
    expectedIcd10Descriptions: ['Sprain of right shoulder joint, initial encounter', 'Pain in right shoulder']
  },
  vague_symptoms: {
    text: 'Patient with vague symptoms including occasional dizziness and fatigue. Request CT head to evaluate.',
    expectedValidationFailure: true,
    expectedFailureReason: 'Insufficient clinical information'
  }
};

// Orders database
const orders = {
  order_a: {
    id: 'order_a',
    status: 'pending_admin',
    cptCode: '72148',
    cptDescription: 'MRI lumbar spine without contrast',
    icd10Codes: ['M54.5', 'M51.36'],
    icd10Descriptions: ['Low back pain', 'Other intervertebral disc degeneration, lumbar region'],
    patient: patients.patient_a,
    physician: users.physician_a,
    organization: organizations.referring_a,
    dictation: dictations.lumbar_mri.text,
    signature: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
    history: [
      { action: 'created', timestamp: '2025-04-15T10:00:00.000Z' },
      { action: 'validated', timestamp: '2025-04-15T10:01:00.000Z' },
      { action: 'finalized', timestamp: '2025-04-15T10:02:00.000Z' }
    ],
    validationAttempts: [
      { attempt: 1, timestamp: '2025-04-15T10:01:00.000Z', status: 'success' }
    ],
    createdAt: '2025-04-15T10:00:00.000Z'
  },
  order_b: {
    id: 'order_b',
    status: 'pending_radiology',
    cptCode: '72148',
    cptDescription: 'MRI lumbar spine without contrast',
    icd10Codes: ['M54.5', 'M51.36'],
    icd10Descriptions: ['Low back pain', 'Other intervertebral disc degeneration, lumbar region'],
    patient: patients.patient_a,
    physician: users.physician_a,
    organization: organizations.referring_a,
    dictation: dictations.lumbar_mri.text,
    signature: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
    history: [
      { action: 'created', timestamp: '2025-04-15T11:00:00.000Z' },
      { action: 'validated', timestamp: '2025-04-15T11:01:00.000Z' },
      { action: 'finalized', timestamp: '2025-04-15T11:02:00.000Z' },
      { action: 'sent_to_radiology', timestamp: '2025-04-15T11:10:00.000Z' }
    ],
    validationAttempts: [
      { attempt: 1, timestamp: '2025-04-15T11:01:00.000Z', status: 'success' }
    ],
    clinicalRecords: [
      {
        id: 'record_a1',
        orderId: 'order_b',
        recordType: 'emr_summary_paste',
        content: 'Patient has history of lumbar disc herniation. MRI from 2023 showed L4-L5 disc bulge.',
        createdAt: '2025-04-15T11:05:00.000Z'
      },
      {
        id: 'record_a2',
        orderId: 'order_b',
        recordType: 'supplemental_docs_paste',
        content: 'Patient tried physical therapy for 6 weeks with minimal improvement.',
        createdAt: '2025-04-15T11:08:00.000Z'
      }
    ],
    createdAt: '2025-04-15T11:00:00.000Z'
  },
  order_c: {
    id: 'order_c',
    status: 'scheduled',
    cptCode: '72148',
    cptDescription: 'MRI lumbar spine without contrast',
    icd10Codes: ['M54.5', 'M51.36'],
    icd10Descriptions: ['Low back pain', 'Other intervertebral disc degeneration, lumbar region'],
    patient: patients.patient_a,
    physician: users.physician_a,
    organization: organizations.referring_a,
    dictation: dictations.lumbar_mri.text,
    signature: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
    scheduledDate: '2025-05-01T14:30:00.000Z',
    schedulingNotes: 'Patient scheduled for 05/01/2025 at 2:30 PM. Please arrive 15 minutes early.',
    history: [
      { action: 'created', timestamp: '2025-04-15T12:00:00.000Z' },
      { action: 'validated', timestamp: '2025-04-15T12:01:00.000Z' },
      { action: 'finalized', timestamp: '2025-04-15T12:02:00.000Z' },
      { action: 'sent_to_radiology', timestamp: '2025-04-15T12:10:00.000Z' },
      { action: 'status_update', newStatus: 'scheduled', timestamp: '2025-04-15T14:00:00.000Z' }
    ],
    validationAttempts: [
      { attempt: 1, timestamp: '2025-04-15T12:01:00.000Z', status: 'success' }
    ],
    clinicalRecords: [
      {
        id: 'record_c1',
        orderId: 'order_c',
        recordType: 'emr_summary_paste',
        content: 'Patient has history of lumbar disc herniation. MRI from 2023 showed L4-L5 disc bulge.',
        createdAt: '2025-04-15T12:05:00.000Z'
      },
      {
        id: 'record_c2',
        orderId: 'order_c',
        recordType: 'supplemental_docs_paste',
        content: 'Patient tried physical therapy for 6 weeks with minimal improvement.',
        createdAt: '2025-04-15T12:08:00.000Z'
      }
    ],
    createdAt: '2025-04-15T12:00:00.000Z'
  },
  order_failed: {
    id: 'order_failed',
    status: 'validation_failed',
    dictation: dictations.vague_symptoms.text,
    patient: patients.patient_b,
    physician: users.physician_b,
    organization: organizations.referring_b,
    validationStatus: 'failed',
    validationAttempts: [
      { attempt: 1, timestamp: '2025-04-15T13:00:00.000Z', status: 'failed' },
      { attempt: 2, timestamp: '2025-04-15T13:05:00.000Z', status: 'failed' },
      { attempt: 3, timestamp: '2025-04-15T13:10:00.000Z', status: 'failed' }
    ],
    history: [
      { action: 'created', timestamp: '2025-04-15T13:00:00.000Z' },
      { action: 'validation_failed', timestamp: '2025-04-15T13:00:00.000Z' },
      { action: 'validation_failed', timestamp: '2025-04-15T13:05:00.000Z' },
      { action: 'validation_failed', timestamp: '2025-04-15T13:10:00.000Z' }
    ],
    createdAt: '2025-04-15T13:00:00.000Z'
  }
};

// Connections database
const connections = {
  connection_a: {
    id: 'conn_a',
    requestingOrganizationId: 'org_ref_a',
    targetOrganizationId: 'org_rad_a',
    status: 'active',
    notes: 'Connection for testing purposes',
    createdAt: '2025-04-15T09:30:00.000Z',
    approvedAt: '2025-04-15T10:30:00.000Z'
  },
  connection_b: {
    id: 'conn_b',
    requestingOrganizationId: 'org_ref_b',
    targetOrganizationId: 'org_rad_b',
    status: 'active',
    notes: 'Connection for testing purposes',
    createdAt: '2025-04-15T11:30:00.000Z',
    approvedAt: '2025-04-15T12:30:00.000Z'
  },
  connection_c: {
    id: 'conn_c',
    requestingOrganizationId: 'org_ref_c',
    targetOrganizationId: 'org_rad_c',
    status: 'pending',
    notes: 'Connection for testing purposes',
    createdAt: '2025-04-15T13:30:00.000Z'
  }
};

// Invitations database
const invitations = {
  invitation_a: {
    id: 'invite_a',
    email: 'new-physician@example.com',
    role: 'physician',
    organizationId: 'org_ref_a',
    token: 'token_a',
    firstName: 'New',
    lastName: 'Physician',
    npi: '9876543210',
    createdAt: '2025-04-15T15:00:00.000Z',
    expiresAt: '2025-04-22T15:00:00.000Z'
  },
  invitation_b: {
    id: 'invite_b',
    email: 'new-scheduler@example.com',
    role: 'scheduler',
    organizationId: 'org_rad_a',
    token: 'token_b',
    firstName: 'New',
    lastName: 'Scheduler',
    createdAt: '2025-04-15T16:00:00.000Z',
    expiresAt: '2025-04-22T16:00:00.000Z'
  }
};

// Document uploads database
const documentUploads = {
  document_a: {
    id: 'doc_a',
    fileName: 'test-document.pdf',
    fileType: 'application/pdf',
    fileKey: 'uploads/test-document.pdf',
    fileUrl: 'https://example-bucket.s3.amazonaws.com/uploads/test-document.pdf',
    category: 'patient_record',
    description: 'Test patient record document',
    uploadedBy: 'user_admin_ref_a',
    organizationId: 'org_ref_a',
    createdAt: '2025-04-15T17:00:00.000Z'
  }
};

// Export all databases
module.exports = {
  organizations,
  users,
  patients,
  dictations,
  orders,
  connections,
  invitations,
  documentUploads
};