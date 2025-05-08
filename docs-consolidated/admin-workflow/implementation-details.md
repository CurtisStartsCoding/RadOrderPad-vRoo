# Admin Finalization Implementation Details

This document provides detailed information about the backend implementation of the Admin Finalization workflow. It covers the components, database interactions, text parsing, security considerations, and testing.

## Architecture Overview

The Admin Finalization workflow is implemented using a modular architecture with clear separation of concerns:

1. **Routes**: Define the API endpoints and handle request/response formatting
2. **Controllers**: Process requests, validate inputs, and coordinate service calls
3. **Services**: Implement business logic and database interactions
4. **Utilities**: Provide helper functions for text parsing and other operations

## Components

### 1. Routes (`src/routes/admin-orders.routes.ts`)

The routes file defines the API endpoints for the Admin Finalization workflow:

```typescript
import { Router } from 'express';
import { authenticateJWT, authorizeRole } from '../middleware/auth';
import adminOrderController from '../controllers/admin-order';

const router = Router();

// Get admin order queue
router.get('/queue',
  authenticateJWT,
  authorizeRole(['admin_staff', 'admin_referring']),
  adminOrderController.getQueue
);

// Process pasted EMR summary
router.post('/:orderId/paste-summary',
  authenticateJWT,
  authorizeRole(['admin_staff', 'admin_referring']),
  adminOrderController.handlePasteSummary
);

// Process pasted supplemental documents
router.post('/:orderId/paste-supplemental',
  authenticateJWT,
  authorizeRole(['admin_staff', 'admin_referring']),
  adminOrderController.handlePasteSupplemental
);

// Send order to radiology
router.post('/:orderId/send-to-radiology',
  authenticateJWT,
  authorizeRole(['admin_staff', 'admin_referring']),
  adminOrderController.sendToRadiology
);

// Fixed implementation of send to radiology
router.post('/:orderId/send-to-radiology-fixed',
  authenticateJWT,
  authorizeRole(['admin_staff', 'admin_referring']),
  adminOrderController.sendToRadiologyFixed
);

// Update patient information
router.put('/:orderId/patient-info',
  authenticateJWT,
  authorizeRole(['admin_staff', 'admin_referring']),
  adminOrderController.updatePatientInfo
);

// Update insurance information
router.put('/:orderId/insurance-info',
  authenticateJWT,
  authorizeRole(['admin_staff', 'admin_referring']),
  adminOrderController.updateInsuranceInfo
);

export default router;
```

### 2. Controller (`src/controllers/admin-order/index.ts`)

The controller module exports methods for handling each endpoint:

```typescript
import { Request, Response } from 'express';
import adminOrderService from '../../services/admin-order';
import { handleControllerError } from '../error-handling';

export default {
  getQueue: async (req: Request, res: Response) => {
    try {
      // Extract query parameters
      const { page, limit, sortBy, sortOrder, status, search } = req.query;
      const { userId, orgId } = req.user;
      
      // Call service method
      const result = await adminOrderService.getQueue({
        userId,
        orgId,
        page: parseInt(page as string) || 1,
        limit: parseInt(limit as string) || 20,
        sortBy: sortBy as string || 'created_at',
        sortOrder: sortOrder as string || 'desc',
        status: status as string || 'pending_admin',
        search: search as string
      });
      
      // Return response
      return res.json({
        success: true,
        data: result
      });
    } catch (error) {
      return handleControllerError(error, res);
    }
  },
  
  handlePasteSummary: async (req: Request, res: Response) => {
    try {
      const { orderId } = req.params;
      const { pastedText } = req.body;
      const { userId, orgId } = req.user;
      
      // Validate input
      if (!pastedText) {
        return res.status(400).json({
          success: false,
          message: 'Pasted text is required'
        });
      }
      
      // Call service method
      const result = await adminOrderService.handlePasteSummary({
        orderId: parseInt(orderId),
        pastedText,
        userId,
        orgId
      });
      
      // Return response
      return res.json({
        success: true,
        message: 'EMR summary processed successfully',
        data: result
      });
    } catch (error) {
      return handleControllerError(error, res);
    }
  },
  
  // Additional controller methods for other endpoints...
};
```

### 3. Service (`src/services/admin-order/index.ts`)

The service module implements the business logic for each endpoint:

```typescript
import { getPhiDbClient, getMainDbClient } from '../../config/db';
import { parsePatientInfo, parseInsuranceInfo } from '../../utils/emr-parser';
import { OrderNotFoundError, InsufficientCreditsError } from '../../errors';

export default {
  getQueue: async (params) => {
    const { userId, orgId, page, limit, sortBy, sortOrder, status, search } = params;
    const offset = (page - 1) * limit;
    
    // Get PHI database client
    const phiDb = getPhiDbClient();
    
    // Build query
    let query = `
      SELECT o.*, p.first_name, p.last_name, p.date_of_birth, p.gender
      FROM orders o
      LEFT JOIN patients p ON o.patient_id = p.id
      WHERE o.organization_id = $1
    `;
    
    const queryParams = [orgId];
    
    // Add status filter
    if (status && status !== 'all') {
      query += ` AND o.status = $${queryParams.length + 1}`;
      queryParams.push(status);
    }
    
    // Add search filter
    if (search) {
      query += ` AND (
        p.first_name ILIKE $${queryParams.length + 1} OR
        p.last_name ILIKE $${queryParams.length + 1} OR
        CAST(o.id AS TEXT) = $${queryParams.length + 2}
      )`;
      queryParams.push(`%${search}%`);
      queryParams.push(search);
    }
    
    // Add sorting
    query += ` ORDER BY o.${sortBy} ${sortOrder === 'asc' ? 'ASC' : 'DESC'}`;
    
    // Add pagination
    query += ` LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
    queryParams.push(limit);
    queryParams.push(offset);
    
    // Execute query
    const result = await phiDb.query(query, queryParams);
    
    // Get total count
    const countQuery = `
      SELECT COUNT(*) FROM orders o
      WHERE o.organization_id = $1
      ${status && status !== 'all' ? 'AND o.status = $2' : ''}
    `;
    const countParams = [orgId];
    if (status && status !== 'all') {
      countParams.push(status);
    }
    const countResult = await phiDb.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);
    
    // Format response
    return {
      orders: result.rows.map(row => ({
        id: row.id,
        patientName: `${row.first_name} ${row.last_name}`,
        patientDateOfBirth: row.date_of_birth,
        patientGender: row.gender,
        modalityType: row.modality_type,
        cptCode: row.cpt_code,
        icd10Codes: row.icd10_codes,
        clinicalIndication: row.clinical_indication,
        status: row.status,
        createdAt: row.created_at,
        signedAt: row.signed_at
      })),
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  },
  
  handlePasteSummary: async (params) => {
    const { orderId, pastedText, userId, orgId } = params;
    
    // Get PHI database client
    const phiDb = getPhiDbClient();
    
    // Start transaction
    await phiDb.query('BEGIN');
    
    try {
      // Check if order exists and belongs to the user's organization
      const orderQuery = `
        SELECT * FROM orders
        WHERE id = $1 AND organization_id = $2
      `;
      const orderResult = await phiDb.query(orderQuery, [orderId, orgId]);
      
      if (orderResult.rows.length === 0) {
        throw new OrderNotFoundError(orderId);
      }
      
      const order = orderResult.rows[0];
      
      // Store the raw pasted text
      const recordQuery = `
        INSERT INTO patient_clinical_records
        (patient_id, order_id, record_type, content, created_by)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id
      `;
      const recordResult = await phiDb.query(recordQuery, [
        order.patient_id,
        orderId,
        'emr_summary_paste',
        pastedText,
        userId
      ]);
      
      const recordId = recordResult.rows[0].id;
      
      // Parse patient information
      const patientInfo = parsePatientInfo(pastedText);
      
      // Update patient information if available
      if (Object.keys(patientInfo).length > 0) {
        const patientQuery = `
          UPDATE patients
          SET
            address_line1 = COALESCE($1, address_line1),
            city = COALESCE($2, city),
            state = COALESCE($3, state),
            zip_code = COALESCE($4, zip_code),
            phone = COALESCE($5, phone),
            email = COALESCE($6, email),
            updated_at = NOW()
          WHERE id = $7
        `;
        await phiDb.query(patientQuery, [
          patientInfo.addressLine1,
          patientInfo.city,
          patientInfo.state,
          patientInfo.zipCode,
          patientInfo.phoneNumber,
          patientInfo.email,
          order.patient_id
        ]);
      }
      
      // Parse insurance information
      const insuranceInfo = parseInsuranceInfo(pastedText);
      
      // Update or insert insurance information if available
      if (Object.keys(insuranceInfo).length > 0) {
        // Check if insurance record exists
        const insuranceCheckQuery = `
          SELECT * FROM patient_insurance
          WHERE patient_id = $1
        `;
        const insuranceCheckResult = await phiDb.query(insuranceCheckQuery, [order.patient_id]);
        
        if (insuranceCheckResult.rows.length > 0) {
          // Update existing record
          const insuranceUpdateQuery = `
            UPDATE patient_insurance
            SET
              insurer_name = COALESCE($1, insurer_name),
              policy_number = COALESCE($2, policy_number),
              group_number = COALESCE($3, group_number),
              policy_holder_name = COALESCE($4, policy_holder_name),
              policy_holder_relationship = COALESCE($5, policy_holder_relationship),
              updated_at = NOW()
            WHERE patient_id = $6
          `;
          await phiDb.query(insuranceUpdateQuery, [
            insuranceInfo.insurerName,
            insuranceInfo.policyNumber,
            insuranceInfo.groupNumber,
            insuranceInfo.policyHolderName,
            insuranceInfo.policyHolderRelationship,
            order.patient_id
          ]);
        } else {
          // Insert new record
          const insuranceInsertQuery = `
            INSERT INTO patient_insurance
            (patient_id, insurer_name, policy_number, group_number, policy_holder_name, policy_holder_relationship)
            VALUES ($1, $2, $3, $4, $5, $6)
          `;
          await phiDb.query(insuranceInsertQuery, [
            order.patient_id,
            insuranceInfo.insurerName,
            insuranceInfo.policyNumber,
            insuranceInfo.groupNumber,
            insuranceInfo.policyHolderName,
            insuranceInfo.policyHolderRelationship
          ]);
        }
      }
      
      // Commit transaction
      await phiDb.query('COMMIT');
      
      // Return result
      return {
        orderId,
        recordId,
        extractedData: {
          patientInfo,
          insuranceInfo
        }
      };
    } catch (error) {
      // Rollback transaction on error
      await phiDb.query('ROLLBACK');
      throw error;
    }
  },
  
  // Additional service methods for other endpoints...
};
```

### 4. Text Parsing (`src/utils/emr-parser.ts`)

The EMR parser utility extracts structured data from pasted EMR text:

```typescript
/**
 * Parse patient information from EMR text
 */
export function parsePatientInfo(text: string) {
  const result: any = {};
  
  // Extract address
  const addressMatch = text.match(/Address:?\s*([^,\n]+)(?:,\s*([^,\n]+))?(?:,\s*([A-Z]{2}))?(?:,?\s*(\d{5}(?:-\d{4})?))?/i);
  if (addressMatch) {
    result.addressLine1 = addressMatch[1]?.trim();
    result.city = addressMatch[2]?.trim();
    result.state = addressMatch[3]?.trim();
    result.zipCode = addressMatch[4]?.trim();
  }
  
  // Extract city, state, zip separately if not found in address
  if (!result.city) {
    const cityMatch = text.match(/City:?\s*([^,\n]+)/i);
    if (cityMatch) {
      result.city = cityMatch[1]?.trim();
    }
  }
  
  if (!result.state) {
    const stateMatch = text.match(/State:?\s*([A-Z]{2})/i);
    if (stateMatch) {
      result.state = stateMatch[1]?.trim();
    }
  }
  
  if (!result.zipCode) {
    const zipMatch = text.match(/(?:ZIP|Zip|Zip Code):?\s*(\d{5}(?:-\d{4})?)/i);
    if (zipMatch) {
      result.zipCode = zipMatch[1]?.trim();
    }
  }
  
  // Extract phone number
  const phoneMatch = text.match(/(?:Phone|Tel|Telephone):?\s*(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})/i);
  if (phoneMatch) {
    result.phoneNumber = phoneMatch[1]?.trim();
  }
  
  // Extract email
  const emailMatch = text.match(/Email:?\s*([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i);
  if (emailMatch) {
    result.email = emailMatch[1]?.trim();
  }
  
  return result;
}

/**
 * Parse insurance information from EMR text
 */
export function parseInsuranceInfo(text: string) {
  const result: any = {};
  
  // Extract insurance provider
  const insurerMatch = text.match(/(?:Insurance|Primary Insurance|Insurance Provider):?\s*([^,\n]+)/i);
  if (insurerMatch) {
    result.insurerName = insurerMatch[1]?.trim();
  }
  
  // Extract policy number
  const policyMatch = text.match(/(?:Policy|Policy Number|Policy #):?\s*([A-Z0-9-]+)/i);
  if (policyMatch) {
    result.policyNumber = policyMatch[1]?.trim();
  }
  
  // Extract group number
  const groupMatch = text.match(/(?:Group|Group Number|Group #):?\s*([A-Z0-9-]+)/i);
  if (groupMatch) {
    result.groupNumber = groupMatch[1]?.trim();
  }
  
  // Extract policy holder
  const holderMatch = text.match(/(?:Policy Holder|Subscriber):?\s*([^,\n]+)/i);
  if (holderMatch) {
    result.policyHolderName = holderMatch[1]?.trim();
  }
  
  // Extract relationship
  const relationshipMatch = text.match(/(?:Relationship|Relationship to Patient):?\s*([^,\n]+)/i);
  if (relationshipMatch) {
    result.policyHolderRelationship = relationshipMatch[1]?.trim().toLowerCase();
  }
  
  return result;
}
```

### 5. Database Connection (`src/config/db.ts`)

The database configuration module provides access to both PHI and Main databases:

```typescript
import { Pool } from 'pg';

// PHI Database connection pool
const phiPool = new Pool({
  host: process.env.PHI_DB_HOST,
  port: parseInt(process.env.PHI_DB_PORT || '5432'),
  database: process.env.PHI_DB_NAME,
  user: process.env.PHI_DB_USER,
  password: process.env.PHI_DB_PASSWORD,
  ssl: process.env.NODE_ENV === 'production'
});

// Main Database connection pool
const mainPool = new Pool({
  host: process.env.MAIN_DB_HOST,
  port: parseInt(process.env.MAIN_DB_PORT || '5432'),
  database: process.env.MAIN_DB_NAME,
  user: process.env.MAIN_DB_USER,
  password: process.env.MAIN_DB_PASSWORD,
  ssl: process.env.NODE_ENV === 'production'
});

// Get PHI database client
export function getPhiDbClient() {
  return phiPool;
}

// Get Main database client
export function getMainDbClient() {
  return mainPool;
}
```

## Database Interactions

The Admin Finalization workflow interacts with the following tables:

### PHI Database

1. **orders**: Stores order information and status
   - Updated when sending to radiology (`status = 'pending_radiology'`)

2. **patients**: Stores patient demographic information
   - Updated when processing EMR summary text

3. **patient_insurance**: Stores insurance information
   - Updated when processing EMR summary text

4. **patient_clinical_records**: Stores raw EMR text and supplemental documentation
   - New records created when processing EMR summary text or supplemental documentation

5. **order_history**: Logs order status changes and events
   - New records created when sending to radiology

### Main Database

1. **organizations**: Stores organization information and credit balance
   - Updated when sending to radiology (decrement `credit_balance`)

2. **credit_usage_logs**: Logs credit usage
   - New records created when sending to radiology

## The Send to Radiology Fix

The original "Send to Radiology" endpoint had an issue with database connections. It was using a single database connection (PHI) to try to access tables in both databases. This resulted in errors like:

```
relation "organizations" does not exist
```

The fixed implementation (`sendToRadiologyFixed`) properly uses both database connections:

```typescript
async sendToRadiologyFixed(params) {
  const { orderId, userId, orgId } = params;
  
  // Get database clients
  const phiDb = getPhiDbClient();
  const mainDb = getMainDbClient();
  
  // Start transactions in both databases
  await phiDb.query('BEGIN');
  await mainDb.query('BEGIN');
  
  try {
    // Check if order exists and belongs to the user's organization
    const orderQuery = `
      SELECT * FROM orders
      WHERE id = $1 AND organization_id = $2
    `;
    const orderResult = await phiDb.query(orderQuery, [orderId, orgId]);
    
    if (orderResult.rows.length === 0) {
      throw new OrderNotFoundError(orderId);
    }
    
    const order = orderResult.rows[0];
    
    // Check if order is in pending_admin status
    if (order.status !== 'pending_admin') {
      throw new Error(`Order ${orderId} is not in pending_admin status`);
    }
    
    // Check if patient information is complete
    const patientQuery = `
      SELECT * FROM patients
      WHERE id = $1
    `;
    const patientResult = await phiDb.query(patientQuery, [order.patient_id]);
    
    if (patientResult.rows.length === 0) {
      throw new Error(`Patient not found for order ${orderId}`);
    }
    
    const patient = patientResult.rows[0];
    
    // Check required patient fields
    if (!patient.city || !patient.state || !patient.zip_code) {
      throw new Error('Patient information is incomplete. City, state, and zip code are required.');
    }
    
    // Check organization credit balance
    const orgQuery = `
      SELECT credit_balance FROM organizations
      WHERE id = $1
    `;
    const orgResult = await mainDb.query(orgQuery, [orgId]);
    
    if (orgResult.rows.length === 0) {
      throw new Error(`Organization ${orgId} not found`);
    }
    
    const organization = orgResult.rows[0];
    
    // Check if organization has sufficient credits
    if (organization.credit_balance <= 0) {
      throw new InsufficientCreditsError(orderId);
    }
    
    // Update order status
    const updateOrderQuery = `
      UPDATE orders
      SET status = $1, updated_at = NOW()
      WHERE id = $2
    `;
    await phiDb.query(updateOrderQuery, ['pending_radiology', orderId]);
    
    // Log order history
    const historyQuery = `
      INSERT INTO order_history
      (order_id, event_type, details, created_by)
      VALUES ($1, $2, $3, $4)
    `;
    await phiDb.query(historyQuery, [
      orderId,
      'sent_to_radiology',
      'Order sent to radiology',
      userId
    ]);
    
    // Decrement organization credit balance
    const updateOrgQuery = `
      UPDATE organizations
      SET credit_balance = credit_balance - 1, updated_at = NOW()
      WHERE id = $1
    `;
    await mainDb.query(updateOrgQuery, [orgId]);
    
    // Log credit usage
    const creditLogQuery = `
      INSERT INTO credit_usage_logs
      (organization_id, order_id, action_type, credits_used, created_by)
      VALUES ($1, $2, $3, $4, $5)
    `;
    await mainDb.query(creditLogQuery, [
      orgId,
      orderId,
      'order_submitted',
      1,
      userId
    ]);
    
    // Commit transactions
    await phiDb.query('COMMIT');
    await mainDb.query('COMMIT');
    
    // Return result
    return {
      orderId,
      status: 'pending_radiology'
    };
  } catch (error) {
    // Rollback transactions on error
    await phiDb.query('ROLLBACK');
    await mainDb.query('ROLLBACK');
    throw error;
  }
}
```

## Security Considerations

1. **Authentication**: All endpoints require a valid JWT token
2. **Authorization**: Endpoints are restricted to users with the `admin_staff` or `admin_referring` role
3. **Data Access Control**: Admin staff can only access orders from their organization
4. **Parameterized Queries**: All database queries use parameterized statements to prevent SQL injection
5. **PHI Handling**: All PHI data is stored in the PHI database
6. **Transaction Management**: Database transactions ensure data consistency

## Testing

The Admin Finalization workflow is tested using a comprehensive test script (`test-admin-finalization.bat`/`.sh`) that tests all implemented endpoints:

1. **Paste EMR Summary**: Tests the `POST /api/admin/orders/{orderId}/paste-summary` endpoint
2. **Paste Supplemental Documents**: Tests the `POST /api/admin/orders/{orderId}/paste-supplemental` endpoint
3. **Update Patient Information**: Tests the `PUT /api/admin/orders/{orderId}/patient-info` endpoint
4. **Update Insurance Information**: Tests the `PUT /api/admin/orders/{orderId}/insurance-info` endpoint
5. **Send to Radiology**: Tests the `POST /api/admin/orders/{orderId}/send-to-radiology-fixed` endpoint

The test script is located in the `all-backend-tests/scripts/` directory and includes tests for both success and error cases.

## Future Enhancements

1. **Advanced Text Parsing**: Enhance the text parsing capabilities to extract more information
2. **Document Upload Integration**: Add support for uploading documents directly
3. **Template Support**: Add support for EMR summary templates
4. **Batch Processing**: Add support for processing multiple orders at once
5. **Validation**: Add validation for patient and insurance information

## Related Documentation

- [Workflow Guide](./workflow-guide.md): Comprehensive end-to-end workflow guide
- [API Integration](./api-integration.md): API details and integration guide
- [Database Architecture](./database-architecture.md): Details on the dual-database architecture
- [Testing Reference](./testing-reference.md): References to test files and testing guidelines