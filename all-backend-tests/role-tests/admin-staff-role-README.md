# Admin Staff (Referring Organization) Role Tests

The Admin Staff role tests (`admin-staff-role-tests.js`) verify all functionality available to admin staff users in the RadOrderPad system. These tests use real API calls to ensure accurate validation of the system's functionality.

## Frontend Implementation Guide

This section provides guidance for frontend developers implementing the Admin Staff role interface.

### User Interface Components

The Admin Staff role requires the following key UI components:

1. **Login Form**
   - Email and password fields
   - Remember me checkbox (optional)
   - Forgot password link
   - Submit button

2. **Admin Order Queue View**
   - Filterable/sortable table of orders awaiting administrative finalization
   - Status indicators
   - Search functionality
   - Pagination controls

3. **Order Details View**
   - Complete order information submitted by the physician
   - Validation results
   - Patient demographics section
   - Insurance information section
   - Supplemental information section
   - Radiology partner selection dropdown
   - "Send to Radiology" button

4. **Patient Demographics Form**
   - First name, last name fields
   - Date of birth field
   - Gender selection
   - Address fields (line 1, line 2, city, state, zip)
   - Contact information (phone, email)
   - Save button

5. **Insurance Information Form**
   - Insurer name field
   - Policy number field
   - Group number field
   - Policy holder name field
   - Relationship to patient selection
   - Save button

6. **Supplemental Information Form**
   - Text area for pasting EMR text
   - File upload option for attaching documents
   - Save button

7. **Radiology Partner Selection**
   - Dropdown of connected radiology organizations
   - Submit button

### Data Flow

1. **Login Flow**:
   ```
   User Input → API Call → JWT Token → Store Token → Redirect to Admin Queue
   ```

2. **Order Processing Flow**:
   ```
   Select Order from Queue → View Order Details →
   Update Patient Demographics → Update Insurance Info →
   Add Supplemental Information → Select Radiology Partner →
   Send to Radiology → Show Success
   ```

3. **Error Handling Flow**:
   ```
   API Error → Check Status Code →
   If 401/403 → Redirect to Login
   If 400 → Show Validation Errors
   If 500 → Show Server Error Message
   ```

## API Endpoints & Implementation Details

1. **Login** (`testAdminStaffLogin`):
   - **Endpoint**: `POST /api/auth/login`
   - **Request Format**:
     ```json
     {
       "email": "admin.staff@example.com",
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
         "firstName": "Admin",
         "lastName": "Staff",
         "email": "admin.staff@example.com",
         "role": "admin_staff"
       }
     }
     ```

2. **Admin Order Queue** (`testAdminOrderQueue`):
   - **Endpoint**: `GET /api/admin/orders/queue`
   - **Headers**:
     - `Authorization: Bearer <jwt_token>`
   - **Query Parameters**:
     - `page`: Page number (default: 1)
     - `limit`: Items per page (default: 10)
     - `sortBy`: Field to sort by (e.g., 'created_at', 'patient_name')
     - `sortOrder`: Sort direction ('asc' or 'desc')
     - `patientName`: Filter by patient name
   - **Success Response** (Status 200):
     ```json
     {
       "orders": [
         {
           "id": "order_123456",
           "status": "pending_admin",
           "patient_name": "John Doe",
           "physician_name": "Dr. Smith",
           "created_at": "2025-05-19T12:34:56.789Z"
         }
       ],
       "pagination": {
         "total": 1,
         "page": 1,
         "pageSize": 10,
         "totalPages": 1
       }
     }
     ```

3. **Order Details** (`testGetOrderDetails`):
   - **Endpoint**: `GET /api/orders/{orderId}`
   - **Headers**:
     - `Authorization: Bearer <jwt_token>`
   - **Success Response** (Status 200):
     ```json
     {
       "id": "order_123456",
       "status": "pending_admin",
       "patientInfo": {
         "firstName": "John",
         "lastName": "Doe",
         "dateOfBirth": "1980-01-01",
         "gender": "male"
       },
       "dictation": "Patient with chest pain, shortness of breath. History of hypertension.",
       "validationResult": {
         "validationStatus": "COMPLIANT",
         "complianceScore": 95,
         "suggestedCodes": [
           { "code": "I20.9", "description": "Angina pectoris, unspecified", "isPrimary": true }
         ]
       },
       "createdAt": "2025-05-19T12:34:56.789Z",
       "updatedAt": "2025-05-19T12:50:56.789Z"
     }
     ```

4. **Update Patient Information** (`testUpdatePatientInfo`):
   - **Endpoint**: `PUT /api/admin/orders/{orderId}/patient-info`
   - **Headers**:
     - `Authorization: Bearer <jwt_token>`
   - **Request Format**:
     ```json
     {
       "first_name": "John",
       "last_name": "Smith",
       "date_of_birth": "1975-01-15",
       "gender": "male",
       "address_line1": "123 Main Street, Apt 4B",
       "city": "Boston",
       "state": "MA",
       "zip_code": "02115",
       "phone_number": "(617) 555-1234",
       "email": "john.smith@example.com"
     }
     ```
   - **Success Response** (Status 200):
     ```json
     {
       "success": true,
       "message": "Patient information updated successfully"
     }
     ```

5. **Update Insurance Information** (`testUpdateInsuranceInfo`):
   - **Endpoint**: `PUT /api/admin/orders/{orderId}/insurance-info`
   - **Headers**:
     - `Authorization: Bearer <jwt_token>`
   - **Request Format**:
     ```json
     {
       "insurerName": "Blue Cross Blue Shield",
       "policyNumber": "XYZ123456789",
       "groupNumber": "BCBS-GROUP-12345",
       "policyHolderName": "John Smith",
       "policyHolderRelationship": "self"
     }
     ```
   - **Success Response** (Status 200):
     ```json
     {
       "success": true,
       "message": "Insurance information updated successfully"
     }
     ```

6. **Paste Supplemental Information** (`testPasteSupplemental`):
   - **Endpoint**: `POST /api/admin/orders/{orderId}/paste-supplemental`
   - **Headers**:
     - `Authorization: Bearer <jwt_token>`
   - **Request Format**:
     ```json
     {
       "pastedText": "Prior Imaging: MRI of lumbar spine performed 6 months ago showed mild disc bulging at L4-L5."
     }
     ```
   - **Success Response** (Status 200):
     ```json
     {
       "success": true,
       "message": "Supplemental information added successfully"
     }
     ```

7. **Upload Document** (`testUploadDocument`):
   - **Step 1**: Get Presigned URL
     - **Endpoint**: `POST /api/uploads/presigned-url`
     - **Headers**:
       - `Authorization: Bearer <jwt_token>`
     - **Request Format**:
       ```json
       {
         "fileName": "patient-history.pdf",
         "contentType": "application/pdf",
         "orderId": "order_123456"
       }
       ```
     - **Success Response** (Status 200):
       ```json
       {
         "success": true,
         "uploadUrl": "https://storage-url.com/upload-path?token=xyz",
         "fileKey": "uploads/order_123456/patient-history.pdf"
       }
       ```
   - **Step 2**: Upload to Storage (direct to cloud storage)
   - **Step 3**: Confirm Upload
     - **Endpoint**: `POST /api/uploads/confirm`
     - **Headers**:
       - `Authorization: Bearer <jwt_token>`
     - **Request Format**:
       ```json
       {
         "fileKey": "uploads/order_123456/patient-history.pdf",
         "orderId": "order_123456",
         "documentType": "supplemental"
       }
       ```
     - **Success Response** (Status 200):
       ```json
       {
         "success": true,
         "message": "Upload confirmed successfully",
         "documentId": "doc_123456"
       }
       ```

8. **List Connected Radiology Organizations** (`testListConnectedRadiologyOrgs`):
   - **Note**: Admin staff users do not have direct API access to list connected radiology organizations.
   - In a real implementation, this would be handled by the frontend UI, which would use the admin_referring
     token to fetch the connections and display them to the admin staff user.
   - For testing purposes, the test uses a hardcoded radiology organization ID.

9. **Send to Radiology** (`testSendToRadiology`):
   - **Endpoint**: `POST /api/admin/orders/{orderId}/send-to-radiology-fixed`
   - **Headers**:
     - `Authorization: Bearer <jwt_token>`
   - **Request Format**:
     ```json
     {
       "radiologyOrganizationId": 1
     }
     ```
   - **Success Response** (Status 200):
     ```json
     {
       "success": true,
       "message": "Order sent to radiology successfully",
       "remainingCredits": 95
     }
     ```

## Running the Tests

To run the Admin Staff role tests:

```
cd all-backend-tests/role-tests
run-admin-staff-role-tests.bat
```

The tests can be run independently from other test suites.

## Test Execution Requirements

The Admin Staff role tests require:

1. **Valid API Credentials**:
   - A valid admin_staff account with correct email and password
   - Proper API access permissions

2. **API Availability**:
   - The RadOrderPad API must be accessible
   - All required endpoints must be operational

3. **Test Environment**:
   - Tests should be run in a controlled environment
   - Test data should not affect production systems

These tests use real API calls and require proper authentication. If login fails, the tests will not proceed, ensuring that only valid interactions are tested.

## Admin Staff Role Coverage

The tests cover all key responsibilities of the Admin Staff role as defined in the system documentation:

1. Login and authentication
2. Monitoring the queue of orders awaiting administrative finalization
3. Viewing detailed order information
4. Adding, verifying, and updating patient demographic information
5. Adding, verifying, and updating patient insurance information
6. Attaching supplemental documentation via text paste or file upload
7. Selecting the appropriate connected radiology group
8. Transmitting the finalized order to the selected radiology group
9. Viewing order history and status for the organization
10. Managing user profile settings

## Frontend Implementation Examples

### 1. Admin Order Queue Implementation

```javascript
// React component example
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminOrderQueue = () => {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const fetchOrders = async (page = 1, limit = 10) => {
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('auth_token');
      
      const response = await axios.get(
        `https://api.radorderpad.com/api/admin/orders/queue?page=${page}&limit=${limit}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      setOrders(response.data.orders);
      setPagination(response.data.pagination);
    } catch (error) {
      setError('Failed to load orders. Please try again.');
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchOrders();
  }, []);
  
  const handlePageChange = (newPage) => {
    fetchOrders(newPage, pagination.pageSize);
  };
  
  return (
    <div className="admin-queue-container">
      <h2>Orders Awaiting Administrative Processing</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      {loading ? (
        <div className="loading">Loading orders...</div>
      ) : (
        <>
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Patient Name</th>
                <th>Physician</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map(order => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.patient_name || 'Unknown'}</td>
                    <td>{order.physician_name}</td>
                    <td>{new Date(order.created_at).toLocaleString()}</td>
                    <td>
                      <button 
                        onClick={() => window.location.href = `/admin/orders/${order.id}`}
                      >
                        Process
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-orders">No orders awaiting processing</td>
                </tr>
              )}
            </tbody>
          </table>
          
          {pagination.totalPages > 1 && (
            <div className="pagination-controls">
              <button 
                disabled={pagination.page === 1}
                onClick={() => handlePageChange(pagination.page - 1)}
              >
                Previous
              </button>
              <span>Page {pagination.page} of {pagination.totalPages}</span>
              <button 
                disabled={pagination.page === pagination.totalPages}
                onClick={() => handlePageChange(pagination.page + 1)}
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

export default AdminOrderQueue;
```

### 2. Patient Information Update Implementation

```javascript
// React component example
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PatientInfoForm = ({ orderId, onSuccess }) => {
  const [patientInfo, setPatientInfo] = useState({
    first_name: '',
    last_name: '',
    date_of_birth: '',
    gender: '',
    address_line1: '',
    city: '',
    state: '',
    zip_code: '',
    phone_number: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPatientInfo(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('auth_token');
      
      const response = await axios.put(
        `https://api.radorderpad.com/api/admin/orders/${orderId}/patient-info`,
        patientInfo,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        if (onSuccess) onSuccess();
      } else {
        setError('Failed to update patient information');
      }
    } catch (error) {
      setError('Error updating patient information: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="patient-info-form">
      <h3>Patient Demographics</h3>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="first_name">First Name</label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={patientInfo.first_name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="last_name">Last Name</label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={patientInfo.last_name}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="date_of_birth">Date of Birth</label>
            <input
              type="date"
              id="date_of_birth"
              name="date_of_birth"
              value={patientInfo.date_of_birth}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="gender">Gender</label>
            <select
              id="gender"
              name="gender"
              value={patientInfo.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="address_line1">Address</label>
          <input
            type="text"
            id="address_line1"
            name="address_line1"
            value={patientInfo.address_line1}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="city">City</label>
            <input
              type="text"
              id="city"
              name="city"
              value={patientInfo.city}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="state">State</label>
            <input
              type="text"
              id="state"
              name="state"
              value={patientInfo.state}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="zip_code">ZIP Code</label>
            <input
              type="text"
              id="zip_code"
              name="zip_code"
              value={patientInfo.zip_code}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="phone_number">Phone Number</label>
            <input
              type="tel"
              id="phone_number"
              name="phone_number"
              value={patientInfo.phone_number}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={patientInfo.email}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Patient Information'}
        </button>
      </form>
    </div>
  );
};

export default PatientInfoForm;