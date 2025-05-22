# Physician Role Tests

The physician role tests (`physician-role-tests.js`) verify all functionality available to physician users in the RadOrderPad system. These tests use real API calls to ensure accurate validation of the system's functionality.

## Frontend Implementation Guide

This section provides guidance for frontend developers implementing the physician role interface.

### User Interface Components

The physician role requires the following key UI components:

1. **Login Form**
   - Email and password fields
   - Remember me checkbox (optional)
   - Forgot password link
   - Submit button

2. **Order Creation Form**
   - Patient selection dropdown/search
   - Dictation text area (with voice input option)
   - Modality selection
   - Submit button

3. **Validation Results View**
   - Compliance score display
   - Suggested CPT/ICD-10 codes list
   - Missing elements warning (if any)
   - Clarification prompt (if needed)
   - Override option (after failed attempts)
   - Proceed to finalization button

4. **Order Finalization Form**
   - Order summary
   - Signature canvas/input
   - Final validation status confirmation
   - CPT code confirmation
   - Submit button

5. **Order List View**
   - Filterable/sortable table of orders
   - Status indicators
   - Search functionality
   - Pagination controls

6. **Profile Management Form**
   - Personal information fields
   - Preferences section
   - Save button

### Data Flow

1. **Login Flow**:
   ```
   User Input → API Call → JWT Token → Store Token → Redirect to Dashboard
   ```

2. **Order Creation Flow**:
   ```
   Dictation Input → Validation API Call →
   If Needs Clarification → Show Prompt → Get More Input → Revalidate →
   If Valid → Show Validation Results → Proceed to Finalization →
   Sign Order → Submit Order → Show Success
   ```

3. **Error Handling Flow**:
   ```
   API Error → Check Status Code →
   If 401/403 → Redirect to Login
   If 400 → Show Validation Errors
   If 500 → Show Server Error Message
   ```

## API Endpoints & Implementation Details

1. **Login** (`testPhysicianLogin`):
   - **Endpoint**: `POST /api/auth/login`
   - **Request Format**:
     ```json
     {
       "email": "test.physician@example.com",
       "password": "password123"
     }
     ```
   - **Success Response** (Status 200):
     ```json
     {
       "success": true,
       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
       "user": {
         "id": 1,
         "firstName": "Test",
         "lastName": "Physician",
         "email": "test.physician@example.com",
         "role": "physician"
       }
     }
     ```

2. **Order Creation** (`testOrderCreation`):
   - **Endpoint**: `POST /api/orders/validate`
   - **Headers**:
     - `Authorization: Bearer <jwt_token>`
   - **Request Format**:
     ```json
     {
       "dictationText": "Patient with chest pain, shortness of breath. History of hypertension. Please evaluate for possible coronary artery disease.",
       "patientInfo": {
         "id": 1
       },
       "radiologyOrganizationId": 1
     }
     ```
   - **Success Response** (Status 200):
     ```json
     {
       "success": true,
       "orderId": "908",
       "validationResult": {
         "validationStatus": "needs_clarification",
         "complianceScore": 7
       }
     }
     ```

3. **Dictation Validation** (`testDictationValidation`):
   - **Endpoint**: `POST /api/orders/validate`
   - **Headers**:
     - `Authorization: Bearer <jwt_token>`
   - **Request Format**:
     ```json
     {
       "dictationText": "Patient with chest pain, shortness of breath. History of hypertension. Please evaluate for possible coronary artery disease.",
       "patientInfo": {
         "id": 1
       },
       "radiologyOrganizationId": 1
     }
     ```
   - **Success Response** (Status 200):
     ```json
     {
       "success": true,
       "validationResult": {
         "validationStatus": "COMPLIANT",
         "complianceScore": 95,
         "suggestedCodes": [
           { "code": "I20.9", "description": "Angina pectoris, unspecified", "isPrimary": true },
           { "code": "I10", "description": "Essential (primary) hypertension", "isPrimary": false }
         ],
         "missingElements": [],
         "feedback": "Dictation is compliant with requirements."
       }
     }
     ```

4. **Order Finalization** (`testOrderFinalization`):
   - **Endpoint**: `PUT /api/orders/{orderId}`
   - **Headers**:
     - `Authorization: Bearer <jwt_token>`
   - **Request Format**:
     ```json
     {
       "orderId": "912",
       "signature": "Dr. Test Physician",
       "finalValidationStatus": "appropriate",
       "finalCPTCode": "71045",
       "clinicalIndication": "Patient with chest pain, shortness of breath. History of hypertension. Please evaluate for possible coronary artery disease."
     }
     ```
   - **Success Response** (Status 200):
     ```json
     {
       "success": true,
       "status": "pending_admin"
     }
     ```

5. **Order Submission** (`testOrderSubmission`):
   - **Endpoint**: `PUT /api/orders/{orderId}`
   - **Headers**:
     - `Authorization: Bearer <jwt_token>`
   - **Request Format**:
     ```json
     {
       "radiologyOrgId": 1,
       "status": "submitted",
       "finalValidationStatus": "appropriate",
       "finalCPTCode": "71045",
       "clinicalIndication": "Patient with chest pain, shortness of breath. History of hypertension. Please evaluate for possible coronary artery disease."
     }
     ```
   - **Success Response** (Status 200):
     ```json
     {
       "success": true,
       "status": "submitted"
     }
     ```

6. **Order Status Check** (`testOrderStatusCheck`):
   - **Endpoint**: `GET /api/orders/{orderId}`
   - **Headers**:
     - `Authorization: Bearer <jwt_token>`
   - **Success Response** (Status 200):
     ```json
     {
       "id": "order_123456",
       "status": "submitted",
       "patientInfo": {
         "firstName": "John",
         "lastName": "Doe",
         "dateOfBirth": "1980-01-01",
         "gender": "male",
         "mrn": "MRN12345"
       },
       "dictation": "Patient with chest pain, shortness of breath. History of hypertension. Please evaluate for possible coronary artery disease.",
       "createdAt": "2025-05-19T12:34:56.789Z",
       "updatedAt": "2025-05-19T12:50:56.789Z"
     }
     ```

7. **Order Listing** (`testOrderListing`):
   - **Endpoint**: `GET /api/orders`
   - **Headers**:
     - `Authorization: Bearer <jwt_token>`
   - **Success Response** (Status 200):
     ```json
     {
       "success": true,
       "orders": [
         {
           "id": "order_123456",
           "status": "submitted",
           "patientInfo": {
             "firstName": "John",
             "lastName": "Doe"
           },
           "createdAt": "2025-05-19T12:34:56.789Z"
         },
         {
           "id": "order_123457",
           "status": "draft",
           "patientInfo": {
             "firstName": "Jane",
             "lastName": "Smith"
           },
           "createdAt": "2025-05-19T13:34:56.789Z"
         }
       ],
       "pagination": {
         "total": 2,
         "page": 1,
         "pageSize": 10,
         "totalPages": 1
       }
     }
     ```

## Running the Tests

To run the physician role tests:

```
cd all-backend-tests/role-tests
run-physician-role-tests.bat
```

The tests can be run independently from other test suites.

## Test Execution Requirements

The physician role tests require:

1. **Valid API Credentials**:
   - A valid physician account with correct email and password
   - Proper API access permissions

2. **API Availability**:
   - The RadOrderPad API must be accessible
   - All required endpoints must be operational

3. **Test Environment**:
   - Tests should be run in a controlled environment
   - Test data should not affect production systems

These tests use real API calls and require proper authentication. If login fails, the tests will not proceed, ensuring that only valid interactions are tested.

## Physician Role Coverage

The tests cover all key responsibilities of the physician role as defined in the system documentation:

1. Login and authentication
2. Creating new radiology orders
3. Dictating clinical indications
4. Initiating and interacting with the validation engine
5. Responding to clarification prompts
6. Overriding validation suggestions with clinical justification
7. Reviewing final validation results
8. Electronically signing finalized orders
9. Viewing order history and status
10. Managing user profile settings

## Frontend Implementation Examples

### 1. Login Implementation

```javascript
// React component example
import React, { useState } from 'react';
import axios from 'axios';

const PhysicianLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('https://api.radorderpad.com/api/auth/login', {
        email,
        password
      });
      
      if (response.data.success && response.data.token) {
        // Store token in localStorage or secure cookie
        localStorage.setItem('auth_token', response.data.token);
        // Redirect to dashboard
        window.location.href = '/dashboard';
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError('Invalid email or password');
      } else {
        setError('An error occurred. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Physician Login</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default PhysicianLogin;
```

### 2. Order Creation and Validation

```javascript
// React component example
import React, { useState } from 'react';
import axios from 'axios';

const OrderCreation = () => {
  const [dictationText, setDictationText] = useState('');
  const [patientId, setPatientId] = useState(1); // Default or selected patient
  const [radiologyOrgId, setRadiologyOrgId] = useState(1); // Default or selected org
  const [loading, setLoading] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [error, setError] = useState('');
  const [orderId, setOrderId] = useState(null);

  const handleValidation = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('auth_token');
      
      const response = await axios.post(
        'https://api.radorderpad.com/api/orders/validate',
        {
          dictationText,
          patientInfo: { id: patientId },
          radiologyOrganizationId: radiologyOrgId
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        setValidationResult(response.data.validationResult);
        setOrderId(response.data.orderId);
      } else {
        setError('Validation failed. Please try again.');
      }
    } catch (error) {
      if (error.response) {
        setError(`Error: ${error.response.data.message || 'Validation failed'}`);
      } else {
        setError('An error occurred. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="order-creation-container">
      <h2>Create New Order</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleValidation}>
        <div className="form-group">
          <label htmlFor="dictation">Clinical Indication</label>
          <textarea
            id="dictation"
            value={dictationText}
            onChange={(e) => setDictationText(e.target.value)}
            placeholder="Enter clinical indication here..."
            rows={5}
            required
          />
        </div>
        
        {/* Patient selection would go here */}
        
        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Validate Order'}
        </button>
      </form>
      
      {validationResult && (
        <div className="validation-results">
          <h3>Validation Results</h3>
          <p>Status: {validationResult.validationStatus}</p>
          <p>Compliance Score: {validationResult.complianceScore}</p>
          
          {validationResult.validationStatus === 'needs_clarification' && (
            <div className="clarification-prompt">
              <p>Please provide additional information:</p>
              {/* Clarification form would go here */}
            </div>
          )}
          
          {validationResult.validationStatus === 'COMPLIANT' && orderId && (
            <button onClick={() => window.location.href = `/finalize-order/${orderId}`}>
              Proceed to Finalization
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderCreation;
```

### 3. Order Listing

```javascript
// React component example
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  useEffect(() => {
    fetchOrders();
  }, [page]);
  
  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('auth_token');
      
      const response = await axios.get(
        `https://api.radorderpad.com/api/orders?page=${page}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        setOrders(response.data.orders);
        if (response.data.pagination) {
          setTotalPages(response.data.pagination.totalPages);
        }
      } else {
        setError('Failed to fetch orders');
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // Token expired, redirect to login
        window.location.href = '/login';
      } else {
        setError('An error occurred while fetching orders');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const getStatusClass = (status) => {
    switch (status) {
      case 'pending_validation': return 'status-pending';
      case 'pending_admin': return 'status-admin';
      case 'submitted': return 'status-submitted';
      default: return '';
    }
  };

  return (
    <div className="order-list-container">
      <h2>My Orders</h2>
      {error && <div className="error-message">{error}</div>}
      
      {loading ? (
        <div className="loading">Loading orders...</div>
      ) : (
        <>
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Patient</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="no-orders">No orders found</td>
                </tr>
              ) : (
                orders.map(order => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>
                      {order.patientInfo ?
                        `${order.patientInfo.firstName} ${order.patientInfo.lastName}` :
                        'Unknown Patient'}
                    </td>
                    <td>
                      <span className={`status-badge ${getStatusClass(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        onClick={() => window.location.href = `/orders/${order.id}`}
                        className="view-button"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          
          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </button>
              <span>Page {page} of {totalPages}</span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default OrderList;
```

## Error Handling Guidelines

When implementing the frontend for the physician role, follow these error handling guidelines:

1. **Authentication Errors (401)**
   - Redirect to login page
   - Clear stored tokens
   - Display friendly message about session expiration

2. **Authorization Errors (403)**
   - Show appropriate message about insufficient permissions
   - Provide link to request access if applicable

3. **Validation Errors (400)**
   - Display field-specific error messages
   - Highlight problematic fields
   - Provide clear guidance on how to fix issues

4. **Server Errors (500)**
   - Show generic error message
   - Provide retry option
   - Log detailed error information for debugging

5. **Network Errors**
   - Implement offline detection
   - Provide retry mechanism
   - Consider implementing request queuing for offline operations

6. **Validation Workflow Errors**
   - Handle clarification prompts with clear UI
   - Provide override option after multiple failed attempts
   - Show detailed feedback on validation failures