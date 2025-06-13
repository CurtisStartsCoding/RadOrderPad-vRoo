# Frontend API Integration Guide

**Version:** 1.0  
**Date:** January 2025  
**Purpose:** Complete guide for replacing hardcoded frontend data with API calls

## Current Frontend State

As of the production branch analysis:

### Already Implemented in Frontend ✅
- **Authentication**: Login/logout with JWT tokens (`/api/auth/login`)
- **Orders List**: Fetching orders with pagination (`/api/orders`)
- **Order Validation**: LLM-powered validation with ACR compliance (`/api/orders/validate`)
- **User Profile**: Retrieved from JWT token and localStorage
- **API Infrastructure**: Central `apiRequest` function with token management
- **Role-based routing**: After login based on user role

### Backend Ready, Frontend Not Yet Integrated ❌
Based on backend tests, these endpoints are working but frontend still uses mock data:
- **Patient Search**: Backend endpoint working (`/api/patients/search`)
- **Order Creation Final**: Signature upload and submission (`/api/orders`)
- **Admin Order Finalization**: All endpoints working including:
  - EMR parsing (`/api/admin/orders/:id/paste-summary`) - 90%+ accuracy
  - Patient/insurance updates
  - Send to radiology (`/api/admin/orders/:id/send-to-radiology-fixed`)
- **User Management**: Full CRUD operations tested
- **Location Management**: Complete CRUD operations working
- **Billing/Credits**: Stripe integration and credit system working
- **Connections**: Request/approval flow working
- **Organization Management**: Update endpoints working
- **File Uploads**: Presigned URLs working (S3 upload works from browser)

This guide focuses on implementing the remaining API integrations.

## Quick Implementation Status

### ✅ Frontend Already Integrated
- Login/Logout (`/api/auth/login`, `/api/auth/logout`)
- Orders List (`/api/orders`)
- User Profile (from JWT token)
- Order Validation (`/api/orders/validate`) - requires 30 second timeout

### 🎯 Priority Integration Tasks (Backend Ready)
All these endpoints are tested and working in the backend:

1. **Complete Physician Order Flow**
   - Patient search (`/api/patients/search`) - Natural language date parsing
   - Signature upload (`/api/uploads/presigned-url` + S3)
   - Final order creation (`/api/orders`)

2. **Admin Staff Finalization Flow**
   - EMR parsing (`/api/admin/orders/:id/paste-summary`) - 90%+ accuracy
   - Patient updates (`/api/admin/orders/:id/patient-info`)
   - Insurance updates (`/api/admin/orders/:id/insurance-info`)
   - Send to radiology (`/api/admin/orders/:id/send-to-radiology-fixed`)

3. **Management Features**
   - User CRUD (`/api/users/*`)
   - Location CRUD (`/api/organizations/mine/locations/*`)
   - Billing/Credits (`/api/billing/*`)
   - Connections (`/api/connections/*`)
   - Organization updates (`/api/organizations/mine`)

## Table of Contents

1. [Overview & Architecture](#overview--architecture)
2. [Common Services Setup](#common-services-setup)
3. [Authentication Pages](#authentication-pages)
4. [Physician Pages](#physician-pages)
5. [Admin Staff Pages](#admin-staff-pages)
6. [Admin Referring Pages](#admin-referring-pages)
7. [Scheduler (Radiology) Pages](#scheduler-radiology-pages)
8. [Admin Radiology Pages](#admin-radiology-pages)
9. [Radiologist Pages](#radiologist-pages)
10. [Implementation Roadmap](#implementation-roadmap)

## Overview & Architecture

### API Service Layer Setup

The frontend already has a working API infrastructure in `client/src/lib/queryClient.ts` with an `apiRequest` function. This handles:
- JWT token management (stored as `rad_order_pad_access_token`)
- Automatic token refresh via headers
- Relative API paths that get proxied to the backend

The existing `apiRequest` function can be extended or used as-is. For new API calls, use this pattern:

```typescript
// Example using the existing apiRequest function
import { apiRequest } from '@/lib/queryClient';

// GET request
const orders = await apiRequest('/api/orders', { 
  method: 'GET' 
});

// POST request with body
const result = await apiRequest('/api/orders/validate', {
  method: 'POST',
  body: JSON.stringify({ dictationText: '...' })
});
```

For consistency with the existing codebase, continue using the `apiRequest` function rather than creating a new service class.

### React Query Integration

The frontend already has React Query configured. Create custom hooks for each API endpoint:

```typescript
// client/src/hooks/useOrders.ts
import { useQuery, useMutation } from '@tanstack/react-query';
import apiService from '../services/api.service';

export function useOrders(filters?: OrderFilters) {
  return useQuery({
    queryKey: ['orders', filters],
    queryFn: () => apiService.get('/api/orders', filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCreateOrder() {
  return useMutation({
    mutationFn: (orderData: CreateOrderDto) => 
      apiService.post('/api/orders', orderData),
    onSuccess: () => {
      // Invalidate orders list to refetch
      queryClient.invalidateQueries(['orders']);
    },
  });
}
```

### Error Handling Pattern

```javascript
// utils/errorHandler.js
export const handleApiError = (error) => {
  if (error.code === 'INSUFFICIENT_CREDITS') {
    return 'Your organization has insufficient credits. Please purchase more.';
  }
  
  if (error.code === 'VALIDATION_ERROR') {
    return error.details ? Object.values(error.details).join(', ') : error.message;
  }
  
  return error.message || 'An unexpected error occurred';
};
```

### Environment Configuration

Since the frontend uses Vite, create a `.env` file in the client directory:

```bash
# client/.env
VITE_API_URL=http://localhost:3001
VITE_STRIPE_PUBLIC_KEY=pk_test_...
VITE_CAPTCHA_SITE_KEY=...
```

Update the existing `vite.config.ts` if needed to ensure environment variables are loaded.

## Common Services Setup

### Authentication Service

Authentication is already implemented in `client/src/lib/auth.ts`. The existing implementation includes:
- `login()` - Makes POST to `/api/auth/login` and stores token
- `logout()` - Calls `/api/auth/logout` and clears storage
- `isAuthenticated()` - Checks JWT token validity
- `getUserFromToken()` - Decodes user data from JWT

**Already Working:**
- Standard login with email/password
- Token storage as `rad_order_pad_access_token`
- User data storage as `rad_order_pad_user_data`
- Role-based redirection after login

**Still Needs Implementation:**
- Trial login endpoint (`/api/auth/trial/login`)
- Password update endpoint (`/api/auth/update-password`)

Example for adding password update:
```typescript
// Add to existing auth.ts
export async function updatePassword(currentPassword: string, newPassword: string) {
  return apiRequest('/api/auth/update-password', {
    method: 'POST',
    body: JSON.stringify({ currentPassword, newPassword })
  });
}
```

### File Upload Service

```javascript
// services/fileUpload.service.js
import apiService from './api.service';

class FileUploadService {
  async uploadFile(file, orderId = null, patientId = null, documentType = 'general') {
    // Step 1: Get presigned URL
    const presignedResponse = await apiService.post('/api/uploads/presigned-url', {
      fileType: file.type,
      fileName: file.name,
      contentType: file.type,
      orderId,
      patientId,
      documentType,
      fileSize: file.size
    });

    // Step 2: Upload to S3
    const uploadResponse = await fetch(presignedResponse.uploadUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type
      }
    });

    if (!uploadResponse.ok) {
      throw new Error('Failed to upload file to S3');
    }

    // Step 3: Confirm upload
    const confirmResponse = await apiService.post('/api/uploads/confirm', {
      fileKey: presignedResponse.fileKey,
      orderId,
      patientId,
      documentType,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type
    });

    return confirmResponse;
  }

  async getDownloadUrl(documentId) {
    return apiService.get(`/api/uploads/${documentId}/download-url`);
  }
}

export default new FileUploadService();
```

## Authentication Pages

### Login Page ✅ Already Implemented

The login page is fully functional at `client/src/pages/auth-page.tsx` using `/api/auth/login`.

### Registration Page ❌ Needs Implementation

**APIs Used:**
- `POST /api/auth/register` - Register organization and admin user

**Implementation:**
```javascript
// pages/Register.jsx
import { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import apiService from '../services/api.service';

function RegisterPage() {
  const [formData, setFormData] = useState({
    organization: {
      name: '',
      type: 'referring_practice', // or 'radiology_group'
      npi: '',
      tax_id: '',
      address_line1: '',
      address_line2: '',
      city: '',
      state: '',
      zip_code: '',
      phone_number: '',
      fax_number: '',
      contact_email: '',
      website: ''
    },
    user: {
      email: '',
      password: '',
      first_name: '',
      last_name: '',
      npi: '',
      specialty: '',
      phone_number: ''
    }
  });
  const [captchaToken, setCaptchaToken] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!captchaToken) {
      alert('Please complete the CAPTCHA');
      return;
    }

    try {
      const response = await apiService.post('/api/auth/register', {
        ...formData,
        captchaToken
      });
      
      // Store token and redirect
      apiService.setAuthToken(response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Organization fields */}
      {/* User fields */}
      <ReCAPTCHA
        sitekey={process.env.REACT_APP_CAPTCHA_SITE_KEY}
        onChange={setCaptchaToken}
      />
      <button type="submit">Register</button>
    </form>
  );
}
```

### Login Page

**APIs Used:**
- `POST /api/auth/login` - Standard login
- `POST /api/auth/trial/login` - Trial user login

**Implementation:**
```javascript
// pages/Login.jsx
import authService from '../services/auth.service';

function LoginPage() {
  const handleLogin = async (email, password, isTrial = false) => {
    try {
      const response = isTrial 
        ? await authService.trialLogin(email, password)
        : await authService.login(email, password);
      
      // Redirect based on role
      switch (response.user.role) {
        case 'physician':
          window.location.href = '/physician/dashboard';
          break;
        case 'admin_staff':
          window.location.href = '/admin/queue';
          break;
        case 'admin_referring':
          window.location.href = '/admin/organization';
          break;
        case 'scheduler':
          window.location.href = '/radiology/orders';
          break;
        case 'admin_radiology':
          window.location.href = '/radiology/admin';
          break;
        case 'radiologist':
          window.location.href = '/radiologist/orders';
          break;
        default:
          window.location.href = '/dashboard';
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };
}
```

## Physician Pages

### Patient Search Page

**APIs Used:**
- `POST /api/patients/search` - Search for existing patients

**Implementation:**
```javascript
// pages/physician/PatientSearch.jsx
import { useState } from 'react';
import apiService from '../../services/api.service';

function PatientSearchPage() {
  const [searchResults, setSearchResults] = useState([]);
  const [isListening, setIsListening] = useState(false);

  // Web Speech API for voice input
  const startVoiceCapture = () => {
    const recognition = new (window.webkitSpeechRecognition || window.SpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    
    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      // Parse transcript to extract patient info
      const parsed = parsePatientInfo(transcript);
      await searchPatient(parsed);
    };
    
    recognition.start();
    setIsListening(true);
  };

  const searchPatient = async (searchData) => {
    try {
      const response = await apiService.post('/api/patients/search', searchData);
      setSearchResults(response.data || []);
    } catch (error) {
      console.error('Patient search failed:', error);
    }
  };

  const parsePatientInfo = (text) => {
    // Extract name and DOB from speech
    // Example: "John Smith born January 15th 1980"
    const nameMatch = text.match(/^([\w\s]+)\s+born/i);
    const dobMatch = text.match(/born\s+(.+)$/i);
    
    return {
      patientName: nameMatch ? nameMatch[1].trim() : text,
      dateOfBirth: dobMatch ? dobMatch[1].trim() : null
    };
  };

  return (
    <div>
      <button onClick={startVoiceCapture}>
        {isListening ? 'Listening...' : 'Start Voice Search'}
      </button>
      
      {/* Manual search form */}
      <form onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        searchPatient({
          patientName: formData.get('patientName'),
          dateOfBirth: formData.get('dateOfBirth')
        });
      }}>
        <input name="patientName" placeholder="Patient Name" />
        <input name="dateOfBirth" type="date" placeholder="Date of Birth" />
        <button type="submit">Search</button>
      </form>

      {/* Search results */}
      <div>
        {searchResults.map(patient => (
          <div key={patient.id} onClick={() => selectPatient(patient)}>
            {patient.first_name} {patient.last_name} - DOB: {patient.date_of_birth}
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Order Creation Page

**APIs Used:**
- `POST /api/orders/validate` ✅ - Validate clinical dictation (WORKING - needs 30s timeout)
- `POST /api/uploads/presigned-url` ❌ - Get signature upload URL
- `POST /api/uploads/confirm` ❌ - Confirm signature upload
- `POST /api/orders` ❌ - Create final order

**What's Working:**
- Order validation with LLM integration
- Iterative refinement for clarifications
- Override capability after 3 attempts

**Still Needs Implementation:**
```javascript
// pages/physician/CreateOrder.jsx
import { useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import apiService from '../../services/api.service';
import fileUploadService from '../../services/fileUpload.service';

function CreateOrderPage() {
  const [dictation, setDictation] = useState('');
  const [validationResult, setValidationResult] = useState(null);
  const [validationAttempts, setValidationAttempts] = useState(0);
  const [signatureRef, setSignatureRef] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const validateDictation = async (overrideValidation = false, overrideJustification = '') => {
    try {
      const response = await apiRequest('/api/orders/validate', {
        method: 'POST',
        body: JSON.stringify({
          dictationText: dictation,
          isOverrideValidation: overrideValidation,
          overrideJustification
        })
      });
      
      setValidationResult(response.validationResult);
      
      if (response.validationResult.validationStatus === 'NEEDS_CLARIFICATION') {
        setValidationAttempts(prev => prev + 1);
      }
      
      return response.validationResult;
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleSignatureUpload = async () => {
    if (!signatureRef) return null;
    
    // Convert signature to blob
    const canvas = signatureRef.getCanvas();
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
    const file = new File([blob], 'signature.png', { type: 'image/png' });
    
    // Upload signature
    const uploadResult = await fileUploadService.uploadFile(file, null, null, 'signature');
    return uploadResult.s3Key;
  };

  const createOrder = async () => {
    try {
      // Upload signature first
      const signatureS3Key = await handleSignatureUpload();
      
      // Create order (Note: validation must be done first via /api/orders/validate)
      const response = await apiRequest('/api/orders', {
        method: 'POST',
        body: JSON.stringify({
        patientId: selectedPatient.id,
        modality: validationResult.suggestedModality,
        bodyPart: validationResult.suggestedBodyPart,
        laterality: validationResult.suggestedLaterality,
        clinicalIndication: dictation,
        suggestedCptCode: validationResult.suggestedCPTCodes[0]?.code,
        suggestedCptCodeDescription: validationResult.suggestedCPTCodes[0]?.description,
        suggestedIcd10Codes: validationResult.suggestedICD10Codes.map(c => c.code),
        suggestedIcd10CodeDescriptions: validationResult.suggestedICD10Codes.map(c => c.description),
        validationStatus: validationResult.validationStatus,
        complianceScore: validationResult.complianceScore,
        signatureS3Key
      });
      
      // Redirect to success page
      window.location.href = `/physician/orders/${response.orderId}`;
    } catch (error) {
      console.error('Order creation failed:', error);
    }
  };

  return (
    <div>
      {/* Patient selection */}
      <div>Selected Patient: {selectedPatient?.name}</div>
      
      {/* Dictation input */}
      <textarea
        value={dictation}
        onChange={(e) => setDictation(e.target.value)}
        placeholder="Clinical indication..."
      />
      
      <button onClick={() => validateDictation()}>Validate</button>
      
      {/* Validation results */}
      {validationResult && (
        <div>
          <p>Status: {validationResult.validationStatus}</p>
          <p>Score: {validationResult.complianceScore}/9</p>
          
          {validationResult.validationStatus === 'NEEDS_CLARIFICATION' && (
            <div>
              <p>{validationResult.clarificationMessage}</p>
              <textarea
                placeholder="Add clarification..."
                onBlur={(e) => setDictation(prev => prev + ' ' + e.target.value)}
              />
              <button onClick={() => validateDictation()}>Re-validate</button>
              
              {validationAttempts >= 3 && (
                <div>
                  <textarea placeholder="Override justification..." id="override-reason" />
                  <button onClick={() => {
                    const justification = document.getElementById('override-reason').value;
                    validateDictation(true, justification);
                  }}>Override Validation</button>
                </div>
              )}
            </div>
          )}
          
          {validationResult.validationStatus === 'APPROPRIATE' && (
            <div>
              <p>CPT: {validationResult.suggestedCPTCodes[0]?.code} - {validationResult.suggestedCPTCodes[0]?.description}</p>
              <p>ICD-10: {validationResult.suggestedICD10Codes.map(c => c.code).join(', ')}</p>
              
              {/* Signature capture */}
              <SignatureCanvas ref={setSignatureRef} />
              
              <button onClick={createOrder}>Create Order</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

### Orders List Page ✅ Already Implemented

The orders list is already working at `client/src/pages/OrderList.tsx` using `GET /api/orders`.

**What's Working:**
- Fetching orders with pagination
- Displaying order data in a table
- Basic filtering by status

**Still Needs:**
- Additional filters (date range, modality, etc.)
- Sorting options
- Search functionality
```

## Admin Staff Pages

### Admin Queue Page

**APIs Used:**
- `GET /api/admin/orders/queue` - Get pending orders
- `GET /api/billing/credit-balance` - Check credit balance

**Implementation:**
```javascript
// pages/admin-staff/AdminQueue.jsx
import { useState, useEffect } from 'react';
import apiService from '../../services/api.service';

function AdminQueuePage() {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20 });
  const [filters, setFilters] = useState({
    patientName: '',
    physicianName: '',
    dateFrom: '',
    dateTo: '',
    originatingLocationId: null,
    sortBy: 'created_at',
    sortOrder: 'desc'
  });
  const [creditBalance, setCreditBalance] = useState(null);

  useEffect(() => {
    loadOrders();
    checkCreditBalance();
  }, [pagination, filters]);

  const loadOrders = async () => {
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters
      };
      
      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (!params[key]) delete params[key];
      });
      
      const response = await apiService.get('/api/admin/orders/queue', params);
      setOrders(response.orders);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Failed to load orders:', error);
    }
  };

  const checkCreditBalance = async () => {
    try {
      const response = await apiService.get('/api/billing/credit-balance');
      setCreditBalance(response.creditBalance);
    } catch (error) {
      console.error('Failed to check credit balance:', error);
    }
  };

  return (
    <div>
      {/* Credit balance warning */}
      {creditBalance !== null && creditBalance < 10 && (
        <div className="alert alert-warning">
          Low credit balance: {creditBalance} credits remaining
        </div>
      )}

      {/* Filters */}
      <div>
        <input 
          placeholder="Patient Name"
          value={filters.patientName}
          onChange={(e) => setFilters({...filters, patientName: e.target.value})}
        />
        <input 
          placeholder="Physician Name"
          value={filters.physicianName}
          onChange={(e) => setFilters({...filters, physicianName: e.target.value})}
        />
        <input 
          type="date"
          value={filters.dateFrom}
          onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
        />
        <input 
          type="date"
          value={filters.dateTo}
          onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
        />
      </div>

      {/* Orders table */}
      <table>
        <thead>
          <tr>
            <th>Order #</th>
            <th>Patient</th>
            <th>DOB</th>
            <th>Physician</th>
            <th>Modality</th>
            <th>Body Part</th>
            <th>Created</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>{order.order_number}</td>
              <td>{order.patient_name}</td>
              <td>{order.patient_dob}</td>
              <td>{order.referring_physician_name}</td>
              <td>{order.modality}</td>
              <td>{order.body_part}</td>
              <td>{new Date(order.created_at).toLocaleDateString()}</td>
              <td>
                <button onClick={() => window.location.href = `/admin/orders/${order.id}/finalize`}>
                  Finalize
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div>
        Page {pagination.page} of {pagination.pages}
        <button onClick={() => setPagination({...pagination, page: pagination.page + 1})}>
          Next
        </button>
      </div>
    </div>
  );
}
```

### Order Finalization Page

**APIs Used:**
- `GET /api/orders/:orderId` - Load order details
- `POST /api/admin/orders/:orderId/paste-summary` - Parse EMR data
- `PUT /api/admin/orders/:orderId/patient-info` - Update patient
- `PUT /api/admin/orders/:orderId/insurance-info` - Update insurance
- `POST /api/uploads/presigned-url` - Document upload URL
- `POST /api/uploads/confirm` - Confirm upload
- `POST /api/admin/orders/:orderId/paste-supplemental` - Add notes
- `POST /api/admin/orders/:orderId/send-to-radiology-fixed` - Send order

**Implementation:**
```javascript
// pages/admin-staff/OrderFinalization.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiService from '../../services/api.service';
import fileUploadService from '../../services/fileUpload.service';

function OrderFinalizationPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [patientInfo, setPatientInfo] = useState({});
  const [insuranceInfo, setInsuranceInfo] = useState({});
  const [emrText, setEmrText] = useState('');
  const [supplementalText, setSupplementalText] = useState('');
  const [radiologyOrgs, setRadiologyOrgs] = useState([]); // Must be provided by frontend
  const [selectedRadiologyOrgId, setSelectedRadiologyOrgId] = useState(null);

  useEffect(() => {
    loadOrderDetails();
    // Frontend must maintain list of radiology organizations
    // This could be loaded from localStorage or passed from parent component
    const storedRadiologyOrgs = JSON.parse(localStorage.getItem('radiologyOrgs') || '[]');
    setRadiologyOrgs(storedRadiologyOrgs);
  }, [orderId]);

  const loadOrderDetails = async () => {
    try {
      const response = await apiService.get(`/api/orders/${orderId}`);
      setOrder(response.data);
      setPatientInfo(response.data.patient || {});
      setInsuranceInfo(response.data.insurance || {});
    } catch (error) {
      console.error('Failed to load order:', error);
    }
  };

  const parseEmrSummary = async () => {
    try {
      const response = await apiService.post(`/api/admin/orders/${orderId}/paste-summary`, {
        pastedText: emrText
      });
      
      // Update forms with parsed data
      if (response.parsedData.patientInfo) {
        setPatientInfo(prev => ({
          ...prev,
          ...response.parsedData.patientInfo
        }));
      }
      
      if (response.parsedData.insuranceInfo) {
        setInsuranceInfo(prev => ({
          ...prev,
          ...response.parsedData.insuranceInfo
        }));
      }
      
      alert('EMR data parsed successfully');
    } catch (error) {
      console.error('Failed to parse EMR:', error);
    }
  };

  const updatePatientInfo = async () => {
    try {
      await apiService.put(`/api/admin/orders/${orderId}/patient-info`, patientInfo);
      alert('Patient information updated');
    } catch (error) {
      console.error('Failed to update patient info:', error);
    }
  };

  const updateInsuranceInfo = async () => {
    try {
      await apiService.put(`/api/admin/orders/${orderId}/insurance-info`, insuranceInfo);
      alert('Insurance information updated');
    } catch (error) {
      console.error('Failed to update insurance info:', error);
    }
  };

  const addSupplementalDocs = async () => {
    try {
      await apiService.post(`/api/admin/orders/${orderId}/paste-supplemental`, {
        pastedText: supplementalText
      });
      alert('Supplemental documents added');
    } catch (error) {
      console.error('Failed to add supplemental docs:', error);
    }
  };

  const handleFileUpload = async (file) => {
    try {
      await fileUploadService.uploadFile(file, orderId, null, 'supplemental');
      alert('File uploaded successfully');
    } catch (error) {
      console.error('Failed to upload file:', error);
    }
  };

  const sendToRadiology = async () => {
    if (!selectedRadiologyOrgId) {
      alert('Please select a radiology organization');
      return;
    }

    try {
      // NOTE: Endpoint uses -fixed suffix to avoid circular dependencies
      const response = await apiRequest(`/api/admin/orders/${orderId}/send-to-radiology-fixed`, {
        method: 'POST',
        body: JSON.stringify({
          radiologyOrganizationId: selectedRadiologyOrgId
        })
      });
      
      if (response.remainingCredits !== undefined) {
        alert(`Order sent successfully. Credits remaining: ${response.remainingCredits}`);
      } else {
        alert('Order sent successfully');
      }
      
      window.location.href = '/admin/queue';
    } catch (error) {
      if (error.code === 'INSUFFICIENT_CREDITS') {
        alert('Insufficient credits. Please purchase more credits.');
      } else {
        console.error('Failed to send order:', error);
      }
    }
  };

  if (!order) return <div>Loading...</div>;

  return (
    <div>
      <h1>Finalize Order #{order.orderNumber}</h1>
      
      {/* Order Summary */}
      <div>
        <h2>Order Information</h2>
        <p>Patient: {order.patientName}</p>
        <p>Modality: {order.modality}</p>
        <p>Body Part: {order.bodyPart}</p>
        <p>Clinical Indication: {order.clinicalIndication}</p>
      </div>

      {/* EMR Paste Tab */}
      <div>
        <h2>Paste EMR Summary</h2>
        <textarea
          value={emrText}
          onChange={(e) => setEmrText(e.target.value)}
          placeholder="Paste EMR summary here..."
          rows={10}
        />
        <button onClick={parseEmrSummary}>Parse EMR Data</button>
      </div>

      {/* Patient Information Tab */}
      <div>
        <h2>Patient Information</h2>
        <input
          placeholder="Address Line 1"
          value={patientInfo.address_line1 || ''}
          onChange={(e) => setPatientInfo({...patientInfo, address_line1: e.target.value})}
        />
        <input
          placeholder="City"
          value={patientInfo.city || ''}
          onChange={(e) => setPatientInfo({...patientInfo, city: e.target.value})}
        />
        <input
          placeholder="State"
          value={patientInfo.state || ''}
          onChange={(e) => setPatientInfo({...patientInfo, state: e.target.value})}
        />
        <input
          placeholder="ZIP Code"
          value={patientInfo.zip_code || ''}
          onChange={(e) => setPatientInfo({...patientInfo, zip_code: e.target.value})}
        />
        <input
          placeholder="Phone"
          value={patientInfo.phone_number || ''}
          onChange={(e) => setPatientInfo({...patientInfo, phone_number: e.target.value})}
        />
        <input
          placeholder="Email"
          value={patientInfo.email || ''}
          onChange={(e) => setPatientInfo({...patientInfo, email: e.target.value})}
        />
        <button onClick={updatePatientInfo}>Update Patient Info</button>
      </div>

      {/* Insurance Information Tab */}
      <div>
        <h2>Insurance Information</h2>
        <input
          placeholder="Insurance Company"
          value={insuranceInfo.insurerName || ''}
          onChange={(e) => setInsuranceInfo({...insuranceInfo, insurerName: e.target.value})}
        />
        <input
          placeholder="Policy Number"
          value={insuranceInfo.policyNumber || ''}
          onChange={(e) => setInsuranceInfo({...insuranceInfo, policyNumber: e.target.value})}
        />
        <input
          placeholder="Group Number"
          value={insuranceInfo.groupNumber || ''}
          onChange={(e) => setInsuranceInfo({...insuranceInfo, groupNumber: e.target.value})}
        />
        <input
          placeholder="Policy Holder Name"
          value={insuranceInfo.policyHolderName || ''}
          onChange={(e) => setInsuranceInfo({...insuranceInfo, policyHolderName: e.target.value})}
        />
        <select
          value={insuranceInfo.policyHolderRelationship || ''}
          onChange={(e) => setInsuranceInfo({...insuranceInfo, policyHolderRelationship: e.target.value})}
        >
          <option value="">Select Relationship</option>
          <option value="Self">Self</option>
          <option value="Spouse">Spouse</option>
          <option value="Child">Child</option>
          <option value="Parent">Parent</option>
          <option value="Other">Other</option>
        </select>
        <button onClick={updateInsuranceInfo}>Update Insurance Info</button>
      </div>

      {/* Supplemental Documents Tab */}
      <div>
        <h2>Supplemental Documents</h2>
        <textarea
          value={supplementalText}
          onChange={(e) => setSupplementalText(e.target.value)}
          placeholder="Paste additional notes or documents..."
          rows={10}
        />
        <button onClick={addSupplementalDocs}>Add Supplemental Text</button>
        
        <input
          type="file"
          accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
          onChange={(e) => handleFileUpload(e.target.files[0])}
        />
      </div>

      {/* Send to Radiology */}
      <div>
        <h2>Send to Radiology</h2>
        <select
          value={selectedRadiologyOrgId || ''}
          onChange={(e) => setSelectedRadiologyOrgId(parseInt(e.target.value))}
        >
          <option value="">Select Radiology Organization</option>
          {radiologyOrgs.map(org => (
            <option key={org.id} value={org.id}>{org.name}</option>
          ))}
        </select>
        <button onClick={sendToRadiology} disabled={!selectedRadiologyOrgId}>
          Send to Radiology
        </button>
      </div>
    </div>
  );
}
```

## Admin Referring Pages

### Organization Management Page

**APIs Used:**
- `GET /api/organizations/mine` - Get organization details
- `PUT /api/organizations/mine` - Update organization

**Implementation:**
```javascript
// pages/admin-referring/OrganizationManagement.jsx
import { useState, useEffect } from 'react';
import apiService from '../../services/api.service';

function OrganizationManagementPage() {
  const [organization, setOrganization] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadOrganization();
  }, []);

  const loadOrganization = async () => {
    try {
      const response = await apiService.get('/api/organizations/mine');
      setOrganization(response.data);
    } catch (error) {
      console.error('Failed to load organization:', error);
    }
  };

  const updateOrganization = async () => {
    try {
      await apiService.put('/api/organizations/mine', organization);
      alert('Organization updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update organization:', error);
    }
  };

  if (!organization) return <div>Loading...</div>;

  return (
    <div>
      <h1>{organization.name}</h1>
      
      {isEditing ? (
        <form onSubmit={(e) => { e.preventDefault(); updateOrganization(); }}>
          <input
            value={organization.name}
            onChange={(e) => setOrganization({...organization, name: e.target.value})}
          />
          <input
            value={organization.npi || ''}
            onChange={(e) => setOrganization({...organization, npi: e.target.value})}
            placeholder="NPI"
          />
          <input
            value={organization.ein || ''}
            onChange={(e) => setOrganization({...organization, ein: e.target.value})}
            placeholder="EIN"
          />
          <input
            value={organization.phone || ''}
            onChange={(e) => setOrganization({...organization, phone: e.target.value})}
            placeholder="Phone"
          />
          <input
            value={organization.email || ''}
            onChange={(e) => setOrganization({...organization, email: e.target.value})}
            placeholder="Email"
          />
          <button type="submit">Save</button>
          <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
        </form>
      ) : (
        <div>
          <p>Type: {organization.type}</p>
          <p>NPI: {organization.npi}</p>
          <p>EIN: {organization.ein}</p>
          <p>Phone: {organization.phone}</p>
          <p>Email: {organization.email}</p>
          <p>Credits: {organization.creditBalance}</p>
          <button onClick={() => setIsEditing(true)}>Edit</button>
        </div>
      )}
    </div>
  );
}
```

### Location Management Page

**APIs Used:**
- `GET /api/organizations/mine/locations` - List locations
- `POST /api/organizations/mine/locations` - Create location
- `PUT /api/organizations/mine/locations/:id` - Update location
- `DELETE /api/organizations/mine/locations/:id` - Delete location

**Implementation:**
```javascript
// pages/admin-referring/LocationManagement.jsx
import { useState, useEffect } from 'react';
import apiService from '../../services/api.service';

function LocationManagementPage() {
  const [locations, setLocations] = useState([]);
  const [newLocation, setNewLocation] = useState({
    name: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    zip_code: '',
    phone_number: '',
    fax_number: ''
  });

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    try {
      const response = await apiService.get('/api/organizations/mine/locations');
      setLocations(response.data);
    } catch (error) {
      console.error('Failed to load locations:', error);
    }
  };

  const createLocation = async () => {
    try {
      await apiService.post('/api/organizations/mine/locations', newLocation);
      alert('Location created successfully');
      loadLocations();
      setNewLocation({
        name: '',
        address_line1: '',
        address_line2: '',
        city: '',
        state: '',
        zip_code: '',
        phone_number: '',
        fax_number: ''
      });
    } catch (error) {
      console.error('Failed to create location:', error);
    }
  };

  const deleteLocation = async (locationId) => {
    if (!window.confirm('Are you sure you want to delete this location?')) return;
    
    try {
      await apiService.delete(`/api/organizations/mine/locations/${locationId}`);
      alert('Location deleted successfully');
      loadLocations();
    } catch (error) {
      console.error('Failed to delete location:', error);
    }
  };

  return (
    <div>
      <h1>Location Management</h1>
      
      {/* Location list */}
      <div>
        {locations.map(location => (
          <div key={location.id}>
            <h3>{location.name}</h3>
            <p>{location.address_line1} {location.address_line2}</p>
            <p>{location.city}, {location.state} {location.zip_code}</p>
            <p>Phone: {location.phone_number}</p>
            <button onClick={() => deleteLocation(location.id)}>Delete</button>
          </div>
        ))}
      </div>

      {/* Add new location */}
      <div>
        <h2>Add New Location</h2>
        <input
          placeholder="Location Name"
          value={newLocation.name}
          onChange={(e) => setNewLocation({...newLocation, name: e.target.value})}
        />
        <input
          placeholder="Address Line 1"
          value={newLocation.address_line1}
          onChange={(e) => setNewLocation({...newLocation, address_line1: e.target.value})}
        />
        <input
          placeholder="City"
          value={newLocation.city}
          onChange={(e) => setNewLocation({...newLocation, city: e.target.value})}
        />
        <input
          placeholder="State"
          value={newLocation.state}
          onChange={(e) => setNewLocation({...newLocation, state: e.target.value})}
        />
        <input
          placeholder="ZIP Code"
          value={newLocation.zip_code}
          onChange={(e) => setNewLocation({...newLocation, zip_code: e.target.value})}
        />
        <button onClick={createLocation}>Create Location</button>
      </div>
    </div>
  );
}
```

### User Management Page

**APIs Used:**
- `GET /api/users` - List users
- `POST /api/user-invites/invite` - Invite new user
- `PUT /api/users/:userId` - Update user
- `DELETE /api/users/:userId` - Delete user
- `GET /api/user-locations/:userId/locations` - Get user's locations
- `POST /api/user-locations/:userId/locations/:locationId` - Assign location
- `DELETE /api/user-locations/:userId/locations/:locationId` - Remove location

**Implementation:**
```javascript
// pages/admin-referring/UserManagement.jsx
import { useState, useEffect } from 'react';
import apiService from '../../services/api.service';

function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [locations, setLocations] = useState([]);
  const [inviteData, setInviteData] = useState({
    email: '',
    role: 'physician',
    sendEmail: true
  });

  useEffect(() => {
    loadUsers();
    loadLocations();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await apiService.get('/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  const loadLocations = async () => {
    try {
      const response = await apiService.get('/api/organizations/mine/locations');
      setLocations(response.data);
    } catch (error) {
      console.error('Failed to load locations:', error);
    }
  };

  const inviteUser = async () => {
    try {
      const response = await apiService.post('/api/user-invites/invite', inviteData);
      alert(`User invited successfully. ${inviteData.sendEmail ? 'Email sent.' : 'Token: ' + response.token}`);
      loadUsers();
      setInviteData({ email: '', role: 'physician', sendEmail: true });
    } catch (error) {
      console.error('Failed to invite user:', error);
    }
  };

  const toggleUserStatus = async (userId, isActive) => {
    try {
      await apiService.put(`/api/users/${userId}`, { isActive: !isActive });
      loadUsers();
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const assignLocation = async (userId, locationId) => {
    try {
      await apiService.post(`/api/user-locations/${userId}/locations/${locationId}`);
      alert('Location assigned successfully');
    } catch (error) {
      console.error('Failed to assign location:', error);
    }
  };

  return (
    <div>
      <h1>User Management</h1>
      
      {/* User list */}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.firstName} {user.lastName}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.isActive ? 'Active' : 'Inactive'}</td>
              <td>
                <button onClick={() => toggleUserStatus(user.id, user.isActive)}>
                  {user.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <select onChange={(e) => assignLocation(user.id, e.target.value)}>
                  <option value="">Assign Location</option>
                  {locations.map(loc => (
                    <option key={loc.id} value={loc.id}>{loc.name}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Invite user */}
      <div>
        <h2>Invite New User</h2>
        <input
          placeholder="Email"
          value={inviteData.email}
          onChange={(e) => setInviteData({...inviteData, email: e.target.value})}
        />
        <select
          value={inviteData.role}
          onChange={(e) => setInviteData({...inviteData, role: e.target.value})}
        >
          <option value="physician">Physician</option>
          <option value="admin_staff">Admin Staff</option>
        </select>
        <label>
          <input
            type="checkbox"
            checked={inviteData.sendEmail}
            onChange={(e) => setInviteData({...inviteData, sendEmail: e.target.checked})}
          />
          Send invitation email
        </label>
        <button onClick={inviteUser}>Invite User</button>
      </div>
    </div>
  );
}
```

### Connection Management Page

**APIs Used:**
- `GET /api/connections` - List connections
- `POST /api/connections` - Send connection request
- `DELETE /api/connections/:relationshipId` - Remove connection

**Implementation:**
```javascript
// pages/admin-referring/ConnectionManagement.jsx
import { useState, useEffect } from 'react';
import apiService from '../../services/api.service';

function ConnectionManagementPage() {
  const [connections, setConnections] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    loadConnections();
  }, []);

  const loadConnections = async () => {
    try {
      const response = await apiService.get('/api/connections');
      setConnections(response.data);
    } catch (error) {
      console.error('Failed to load connections:', error);
    }
  };

  const searchOrganizations = async () => {
    try {
      const response = await apiService.get('/api/organizations/search', {
        search: searchTerm
      });
      setSearchResults(response.data);
    } catch (error) {
      console.error('Failed to search organizations:', error);
    }
  };

  const sendConnectionRequest = async (targetOrgId) => {
    try {
      await apiService.post('/api/connections', {
        targetOrganizationId: targetOrgId,
        message: 'We would like to connect with your organization'
      });
      alert('Connection request sent');
      loadConnections();
    } catch (error) {
      console.error('Failed to send connection request:', error);
    }
  };

  const removeConnection = async (relationshipId) => {
    if (!window.confirm('Are you sure you want to remove this connection?')) return;
    
    try {
      await apiService.delete(`/api/connections/${relationshipId}`);
      alert('Connection removed');
      loadConnections();
    } catch (error) {
      console.error('Failed to remove connection:', error);
    }
  };

  return (
    <div>
      <h1>Connection Management</h1>
      
      {/* Active connections */}
      <div>
        <h2>Active Connections</h2>
        {connections.filter(c => c.status === 'active').map(connection => (
          <div key={connection.id}>
            <h3>{connection.targetOrganization.name}</h3>
            <p>Type: {connection.targetOrganization.type}</p>
            <button onClick={() => removeConnection(connection.id)}>Remove</button>
          </div>
        ))}
      </div>

      {/* Pending requests */}
      <div>
        <h2>Pending Requests</h2>
        {connections.filter(c => c.status === 'pending').map(connection => (
          <div key={connection.id}>
            <h3>{connection.targetOrganization.name}</h3>
            <p>Requested: {new Date(connection.createdAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>

      {/* Search and connect */}
      <div>
        <h2>Find Organizations to Connect</h2>
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search organizations..."
        />
        <button onClick={searchOrganizations}>Search</button>
        
        <div>
          {searchResults.map(org => (
            <div key={org.id}>
              <h4>{org.name}</h4>
              <p>Type: {org.type}</p>
              <button onClick={() => sendConnectionRequest(org.id)}>
                Send Connection Request
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

### Billing Page

**APIs Used:**
- `GET /api/billing` - Get billing overview
- `POST /api/billing/create-checkout-session` - Create Stripe checkout
- `GET /api/billing/credit-usage` - Get usage history
- `POST /api/billing/subscriptions` - Create subscription

**Implementation:**
```javascript
// pages/admin-referring/BillingPage.jsx
import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import apiService from '../../services/api.service';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

function BillingPage() {
  const [billingInfo, setBillingInfo] = useState(null);
  const [creditUsage, setCreditUsage] = useState([]);
  const [creditAmount, setCreditAmount] = useState(100);

  useEffect(() => {
    loadBillingInfo();
    loadCreditUsage();
  }, []);

  const loadBillingInfo = async () => {
    try {
      const response = await apiService.get('/api/billing');
      setBillingInfo(response.data);
    } catch (error) {
      console.error('Failed to load billing info:', error);
    }
  };

  const loadCreditUsage = async () => {
    try {
      const response = await apiService.get('/api/billing/credit-usage', {
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date().toISOString()
      });
      setCreditUsage(response.data);
    } catch (error) {
      console.error('Failed to load credit usage:', error);
    }
  };

  const purchaseCredits = async () => {
    try {
      const response = await apiService.post('/api/billing/create-checkout-session', {
        priceId: process.env.REACT_APP_STRIPE_PRICE_ID,
        quantity: creditAmount,
        successUrl: window.location.origin + '/billing/success',
        cancelUrl: window.location.origin + '/billing'
      });
      
      // Redirect to Stripe checkout
      const stripe = await stripePromise;
      await stripe.redirectToCheckout({ sessionId: response.sessionId });
    } catch (error) {
      console.error('Failed to create checkout session:', error);
    }
  };

  const openBillingPortal = () => {
    if (billingInfo?.stripeCustomerPortalUrl) {
      window.open(billingInfo.stripeCustomerPortalUrl, '_blank');
    }
  };

  if (!billingInfo) return <div>Loading...</div>;

  return (
    <div>
      <h1>Billing & Credits</h1>
      
      {/* Current balance */}
      <div>
        <h2>Credit Balance</h2>
        <p className="text-3xl">{billingInfo.currentCreditBalance} credits</p>
        {billingInfo.currentCreditBalance < 50 && (
          <p className="text-warning">Low balance - consider purchasing more credits</p>
        )}
      </div>

      {/* Subscription info */}
      {billingInfo.subscriptionTier && (
        <div>
          <h2>Subscription</h2>
          <p>Tier: {billingInfo.subscriptionTier}</p>
          <p>Status: {billingInfo.stripeSubscriptionStatus}</p>
          <p>Next billing: {new Date(billingInfo.currentPeriodEnd).toLocaleDateString()}</p>
          <button onClick={openBillingPortal}>Manage Subscription</button>
        </div>
      )}

      {/* Purchase credits */}
      <div>
        <h2>Purchase Credits</h2>
        <select value={creditAmount} onChange={(e) => setCreditAmount(parseInt(e.target.value))}>
          <option value={100}>100 credits - $100</option>
          <option value={500}>500 credits - $475 (5% discount)</option>
          <option value={1000}>1000 credits - $900 (10% discount)</option>
        </select>
        <button onClick={purchaseCredits}>Purchase</button>
      </div>

      {/* Usage history */}
      <div>
        <h2>Recent Usage (Last 30 Days)</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Order #</th>
              <th>Credits Used</th>
              <th>Balance After</th>
            </tr>
          </thead>
          <tbody>
            {creditUsage.map((usage, index) => (
              <tr key={index}>
                <td>{new Date(usage.createdAt).toLocaleDateString()}</td>
                <td>{usage.orderNumber}</td>
                <td>-{usage.creditsUsed}</td>
                <td>{usage.balanceAfter}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

## Scheduler (Radiology) Pages

### Incoming Orders Queue

**APIs Used:**
- `GET /api/radiology/orders` - Get incoming orders from referring orgs

**Implementation:**
```javascript
// pages/scheduler/IncomingOrders.jsx
import { useState, useEffect } from 'react';
import apiService from '../../services/api.service';

function IncomingOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [filters, setFilters] = useState({
    referringOrgId: '',
    priority: '',
    modality: '',
    startDate: '',
    endDate: '',
    page: 1,
    limit: 20
  });
  const [referringOrgs, setReferringOrgs] = useState([]);

  useEffect(() => {
    loadOrders();
    // Frontend should maintain list of referring organizations
    // from connection management or initial data load
  }, [filters]);

  const loadOrders = async () => {
    try {
      const params = { ...filters };
      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (!params[key]) delete params[key];
      });
      
      const response = await apiService.get('/api/radiology/orders', params);
      setOrders(response.orders);
    } catch (error) {
      console.error('Failed to load orders:', error);
    }
  };

  return (
    <div>
      <h1>Incoming Radiology Orders</h1>
      
      {/* Filters */}
      <div>
        <select
          value={filters.priority}
          onChange={(e) => setFilters({...filters, priority: e.target.value})}
        >
          <option value="">All Priorities</option>
          <option value="stat">STAT</option>
          <option value="urgent">Urgent</option>
          <option value="routine">Routine</option>
        </select>
        
        <select
          value={filters.modality}
          onChange={(e) => setFilters({...filters, modality: e.target.value})}
        >
          <option value="">All Modalities</option>
          <option value="CT">CT</option>
          <option value="MRI">MRI</option>
          <option value="XR">X-Ray</option>
          <option value="US">Ultrasound</option>
          <option value="NM">Nuclear Medicine</option>
          <option value="PET">PET</option>
        </select>
        
        <input
          type="date"
          value={filters.startDate}
          onChange={(e) => setFilters({...filters, startDate: e.target.value})}
        />
      </div>

      {/* Orders table */}
      <table>
        <thead>
          <tr>
            <th>Order #</th>
            <th>Priority</th>
            <th>Patient</th>
            <th>Modality</th>
            <th>Referring Org</th>
            <th>Physician</th>
            <th>Created</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id} className={order.priority === 'stat' ? 'priority-stat' : ''}>
              <td>{order.orderNumber}</td>
              <td>{order.priority?.toUpperCase()}</td>
              <td>{order.patient.firstName} {order.patient.lastName}</td>
              <td>{order.modality}</td>
              <td>{order.referringOrganization.name}</td>
              <td>{order.orderingPhysician.name}</td>
              <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              <td>
                <button onClick={() => window.location.href = `/radiology/orders/${order.id}`}>
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

### Order Details Page (Radiology View)

**APIs Used:**
- `GET /api/radiology/orders/:orderId` - Get full order details
- `GET /api/radiology/orders/:orderId/insurance` - Get insurance info
- `GET /api/radiology/orders/:orderId/documents` - Get documents
- `POST /api/radiology/orders/:orderId/request-info` - Request additional info
- `PUT /api/radiology/orders/:orderId/status` - Update order status

**Implementation:**
```javascript
// pages/scheduler/OrderDetails.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiService from '../../services/api.service';

function RadiologyOrderDetailsPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [insurance, setInsurance] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [infoRequest, setInfoRequest] = useState('');
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    loadOrderDetails();
    loadInsurance();
    loadDocuments();
  }, [orderId]);

  const loadOrderDetails = async () => {
    try {
      const response = await apiService.get(`/api/radiology/orders/${orderId}`);
      setOrder(response.data);
      setNewStatus(response.data.status);
    } catch (error) {
      console.error('Failed to load order details:', error);
    }
  };

  const loadInsurance = async () => {
    try {
      const response = await apiService.get(`/api/radiology/orders/${orderId}/insurance`);
      setInsurance(response.data);
    } catch (error) {
      console.error('Failed to load insurance:', error);
    }
  };

  const loadDocuments = async () => {
    try {
      const response = await apiService.get(`/api/radiology/orders/${orderId}/documents`);
      setDocuments(response.documents);
    } catch (error) {
      console.error('Failed to load documents:', error);
    }
  };

  const requestInformation = async () => {
    try {
      await apiService.post(`/api/radiology/orders/${orderId}/request-info`, {
        requestType: 'additional_information',
        message: infoRequest
      });
      alert('Information request sent');
      setInfoRequest('');
    } catch (error) {
      console.error('Failed to send info request:', error);
    }
  };

  const updateOrderStatus = async () => {
    try {
      await apiService.put(`/api/radiology/orders/${orderId}/status`, {
        status: newStatus,
        notes: `Status updated to ${newStatus}`
      });
      alert('Status updated successfully');
      loadOrderDetails();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  if (!order) return <div>Loading...</div>;

  return (
    <div>
      <h1>Order #{order.orderNumber}</h1>
      
      {/* Patient Information */}
      <section>
        <h2>Patient Information</h2>
        <p>Name: {order.patient.firstName} {order.patient.lastName}</p>
        <p>DOB: {order.patient.dateOfBirth}</p>
        <p>Gender: {order.patient.gender}</p>
        <p>MRN: {order.patient.mrn}</p>
        <p>Phone: {order.patient.phoneNumber}</p>
        <p>Email: {order.patient.email}</p>
        <p>Address: {order.patient.address}</p>
      </section>

      {/* Clinical Information */}
      <section>
        <h2>Clinical Information</h2>
        <p>Modality: {order.modality}</p>
        <p>Body Part: {order.bodyPart}</p>
        <p>Laterality: {order.laterality}</p>
        <p>Clinical Indication: {order.clinicalIndication}</p>
        <p>CPT Code: {order.cptCode} - {order.cptCodeDescription}</p>
        <p>ICD-10 Codes: {order.icd10Codes.join(', ')}</p>
      </section>

      {/* Insurance Information */}
      {insurance && (
        <section>
          <h2>Insurance Information</h2>
          <p>Company: {insurance.insurerName}</p>
          <p>Policy #: {insurance.policyNumber}</p>
          <p>Group #: {insurance.groupNumber}</p>
          <p>Policy Holder: {insurance.policyHolderName}</p>
          <p>Relationship: {insurance.policyHolderRelationship}</p>
        </section>
      )}

      {/* Documents */}
      <section>
        <h2>Documents</h2>
        {documents.map(doc => (
          <div key={doc.id}>
            <a href={doc.downloadUrl} target="_blank" rel="noopener noreferrer">
              {doc.fileName}
            </a>
          </div>
        ))}
      </section>

      {/* Request Information */}
      <section>
        <h2>Request Additional Information</h2>
        <textarea
          value={infoRequest}
          onChange={(e) => setInfoRequest(e.target.value)}
          placeholder="Describe what information is needed..."
        />
        <button onClick={requestInformation}>Send Request</button>
      </section>

      {/* Update Status */}
      <section>
        <h2>Update Order Status</h2>
        <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
          <option value="sent_to_radiology">Pending Review</option>
          <option value="scheduled">Scheduled</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <button onClick={updateOrderStatus}>Update Status</button>
      </section>
    </div>
  );
}
```

### Export Page

**APIs Used:**
- `GET /api/radiology/orders/export` - Export orders in various formats

**Implementation:**
```javascript
// pages/scheduler/ExportOrders.jsx
import { useState } from 'react';
import apiService from '../../services/api.service';

function ExportOrdersPage() {
  const [exportParams, setExportParams] = useState({
    format: 'csv',
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    status: '',
    includePatientInfo: true,
    includeInsuranceInfo: true
  });

  const exportOrders = async () => {
    try {
      const response = await apiService.get('/api/radiology/orders/export', exportParams);
      
      // Create download link
      const blob = new Blob([response.data], { 
        type: exportParams.format === 'csv' ? 'text/csv' : 'application/json' 
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `radiology_orders_${exportParams.startDate}_${exportParams.endDate}.${exportParams.format}`;
      a.click();
    } catch (error) {
      console.error('Failed to export orders:', error);
    }
  };

  return (
    <div>
      <h1>Export Orders</h1>
      
      <div>
        <label>
          Format:
          <select 
            value={exportParams.format} 
            onChange={(e) => setExportParams({...exportParams, format: e.target.value})}
          >
            <option value="csv">CSV</option>
            <option value="json">JSON</option>
            <option value="hl7">HL7</option>
          </select>
        </label>
      </div>

      <div>
        <label>
          Start Date:
          <input
            type="date"
            value={exportParams.startDate}
            onChange={(e) => setExportParams({...exportParams, startDate: e.target.value})}
          />
        </label>
      </div>

      <div>
        <label>
          End Date:
          <input
            type="date"
            value={exportParams.endDate}
            onChange={(e) => setExportParams({...exportParams, endDate: e.target.value})}
          />
        </label>
      </div>

      <div>
        <label>
          Status:
          <select
            value={exportParams.status}
            onChange={(e) => setExportParams({...exportParams, status: e.target.value})}
          >
            <option value="">All Statuses</option>
            <option value="sent_to_radiology">Pending</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
          </select>
        </label>
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            checked={exportParams.includePatientInfo}
            onChange={(e) => setExportParams({...exportParams, includePatientInfo: e.target.checked})}
          />
          Include Patient Information
        </label>
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            checked={exportParams.includeInsuranceInfo}
            onChange={(e) => setExportParams({...exportParams, includeInsuranceInfo: e.target.checked})}
          />
          Include Insurance Information
        </label>
      </div>

      <button onClick={exportOrders}>Export Orders</button>
    </div>
  );
}
```

## Admin Radiology Pages

### Organization Management (Radiology)

Same as Admin Referring but for radiology organizations.

### Billing Page (Radiology)

**APIs Used:**
- `GET /api/billing` - Get billing overview (read-only for radiology)

**Implementation:**
```javascript
// pages/admin-radiology/BillingPage.jsx
import { useState, useEffect } from 'react';
import apiService from '../../services/api.service';

function RadiologyBillingPage() {
  const [billingInfo, setBillingInfo] = useState(null);

  useEffect(() => {
    loadBillingInfo();
  }, []);

  const loadBillingInfo = async () => {
    try {
      const response = await apiService.get('/api/billing');
      setBillingInfo(response.data);
    } catch (error) {
      console.error('Failed to load billing info:', error);
    }
  };

  if (!billingInfo) return <div>Loading...</div>;

  return (
    <div>
      <h1>Credit Balance</h1>
      
      {/* Dual credit display for radiology */}
      <div>
        <h2>Available Credits</h2>
        <div>
          <h3>Basic Imaging Credits</h3>
          <p className="text-3xl">{billingInfo.basicCreditBalance || 0}</p>
          <p className="text-muted">For X-Ray, Ultrasound, etc.</p>
        </div>
        
        <div>
          <h3>Advanced Imaging Credits</h3>
          <p className="text-3xl">{billingInfo.advancedCreditBalance || 0}</p>
          <p className="text-muted">For MRI, CT, PET, Nuclear</p>
        </div>
      </div>

      <div className="alert alert-info">
        <p>Credits are automatically consumed when you receive orders:</p>
        <ul>
          <li>Basic imaging orders consume 1 basic credit</li>
          <li>Advanced imaging orders consume 1 advanced credit</li>
        </ul>
        <p>Contact your referring partners to purchase additional credits.</p>
      </div>
    </div>
  );
}
```

## Radiologist Pages

### My Orders Page

**APIs Used:**
- `GET /api/radiology/orders/mine` - Get assigned orders
- `POST /api/radiology/reports/:orderId` - Submit report

**Implementation:**
```javascript
// pages/radiologist/MyOrders.jsx
import { useState, useEffect } from 'react';
import apiService from '../../services/api.service';

function RadiologistOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [report, setReport] = useState('');

  useEffect(() => {
    loadMyOrders();
  }, []);

  const loadMyOrders = async () => {
    try {
      const response = await apiService.get('/api/radiology/orders/mine');
      setOrders(response.orders);
    } catch (error) {
      console.error('Failed to load orders:', error);
    }
  };

  const submitReport = async (orderId) => {
    try {
      await apiService.post(`/api/radiology/reports/${orderId}`, {
        findings: report,
        impression: '',
        recommendations: ''
      });
      alert('Report submitted successfully');
      setReport('');
      setSelectedOrder(null);
      loadMyOrders();
    } catch (error) {
      console.error('Failed to submit report:', error);
    }
  };

  return (
    <div>
      <h1>My Assigned Orders</h1>
      
      <div className="grid grid-cols-2">
        {/* Order list */}
        <div>
          {orders.map(order => (
            <div 
              key={order.id} 
              onClick={() => setSelectedOrder(order)}
              className={selectedOrder?.id === order.id ? 'selected' : ''}
            >
              <h3>{order.orderNumber}</h3>
              <p>{order.patient.name} - {order.modality}</p>
              <p>Status: {order.status}</p>
            </div>
          ))}
        </div>

        {/* Report entry */}
        {selectedOrder && (
          <div>
            <h2>Submit Report for {selectedOrder.orderNumber}</h2>
            <textarea
              value={report}
              onChange={(e) => setReport(e.target.value)}
              placeholder="Enter findings..."
              rows={20}
            />
            <button onClick={() => submitReport(selectedOrder.id)}>
              Submit Report
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
```

## Implementation Roadmap

### Phase 1: Foundation (Week 1)
1. **Set up API service layer** with authentication
2. **Implement login/logout** flow
3. **Create user profile** management
4. **Set up routing** based on user roles

### Phase 2: Read Operations (Week 2)
1. **Replace static lists** with API calls:
   - Physician order list
   - Admin queue
   - Scheduler incoming orders
2. **Implement pagination** and filters
3. **Add loading states** and error handling

### Phase 3: Create Operations (Week 3)
1. **Physician order creation** workflow
2. **User invitation** system
3. **Location management**
4. **Connection requests**

### Phase 4: Update Operations (Week 4)
1. **Admin order finalization** flow
2. **Status updates** for schedulers
3. **Profile updates**
4. **Organization updates**

### Phase 5: Advanced Features (Week 5)
1. **File upload** integration
2. **EMR parsing** functionality
3. **Billing/credit** management
4. **Export functionality**

### Phase 6: Polish & Testing (Week 6)
1. **Error handling** improvements
2. **Performance optimization**
3. **Integration testing**
4. **User acceptance testing**

## Testing Strategy

### Unit Tests
- Test API service methods
- Test data transformation functions
- Test error handling

### Integration Tests
- Test complete user workflows
- Test API error scenarios
- Test authentication flows

### E2E Tests
- Test critical paths for each role
- Test multi-step workflows
- Test edge cases

## Notes & Considerations

1. **Location-Based Filtering**: The backend has fields for location filtering but it's not fully implemented. Frontend should be prepared to add location filters when backend support is complete.

2. **Radiology Organization List**: Admin staff cannot fetch connected radiology orgs via API. Frontend must maintain this list through other means (initial data load, localStorage, or parent component).

3. **Credit Warnings**: Always check credit balance before operations that consume credits. Show warnings when balance is low.

4. **Role-Based UI**: Components should adapt based on user role. Some endpoints return different data based on role.

5. **Dual Credit System**: Radiology organizations use two credit types. UI must show both balances clearly.

6. **File Size Limits**: 
   - PDFs: 20MB max
   - Other files: 5MB max

7. **CAPTCHA**: Registration requires CAPTCHA token. Use test mode flag during development.

8. **WebSocket Considerations**: Current API is REST-only. For real-time updates, consider polling or future WebSocket implementation.

This comprehensive guide provides everything needed to replace hardcoded frontend data with real API integrations. Follow the implementation roadmap for a systematic approach to the migration.