# Connections Feature Documentation

## Overview

The Connections feature allows organizations to establish partnerships with each other. Referring practices can connect with radiology groups to enable order routing. This feature is restricted to admin roles (`admin_referring` and `admin_radiology`).

## UI Location

The Connections page is accessible from:
- Hamburger menu → "Connections" (for admin users only)
- Direct URL: `/connections`

## Features

### 1. View Connections
- **Active Connections Tab**: Shows established partnerships
- **Pending Requests Tab**: Shows connection requests awaiting approval
- Each connection displays:
  - Organization name and ID
  - Organization type (Referring Practice or Radiology Group)
  - Connection ID (for debugging)
  - Direction (Incoming or Outgoing Request)
  - Request date
  - Action buttons based on status

### 2. Request New Connection
- Click "Request Connection" button in the top right
- Select a radiology organization from the dropdown
- Organization IDs are shown for clarity
- Send the request with a default partnership message

### 3. Connection States
- **Pending**: Request sent, awaiting approval
- **Active**: Connection established, orders can be exchanged
- **Rejected**: Request was declined
- **Terminated**: Previously active connection was ended

### 4. Actions Available
- **For Incoming Requests**: Approve or Decline buttons
- **For Outgoing Requests**: "Pending Approval" status with Cancel option
- **For Active Connections**: Terminate button

## Technical Implementation

### Frontend Components
- **Location**: `client/src/pages/Connections.tsx`
- **UI Components**: Uses shadcn/ui components (Dialog, Select, Tabs)
- **State Management**: React Query for API calls
- **Real-time Updates**: Automatic refresh after actions

### API Endpoints Used
1. **GET /api/connections** - Fetch all connections
   - Returns: `{ connections: [...] }`
   - Each connection includes: id, partnerOrgId, partnerOrgName, status, isInitiator

2. **POST /api/connections** - Create new connection request
   - Body: `{ targetOrgId: number, notes: string }`
   - Returns: `{ success: true, message: string, relationshipId: number }`

3. **POST /api/connections/:id/approve** - Approve incoming request
   - Only works for requests TO your organization

4. **POST /api/connections/:id/reject** - Reject incoming request
   - Only works for requests TO your organization

5. **DELETE /api/connections/:id** - Terminate active connection
   - Either organization can terminate

### Connection Rules
1. Only one connection record can exist between any two organizations
2. Cannot send duplicate requests (must terminate/reject first)
3. Only admins can manage connections
4. Orders can only be sent between organizations with active connections

## Known Limitations

1. **Approval Restriction**: You cannot approve your own outgoing requests. The receiving organization must approve them.
2. **Test Organizations**: Test organizations created without real users cannot have their incoming requests approved.
3. **No Edit Function**: Connection requests cannot be edited after sending.

## User Workflow Example

1. Admin from Referring Practice logs in
2. Navigates to Connections page
3. Clicks "Request Connection"
4. Selects a Radiology Group from dropdown
5. Sends request
6. Radiology Group admin sees request in their "Pending Requests"
7. Radiology Group admin approves request
8. Both organizations now see active connection
9. Orders can now be routed between organizations

## Error Handling

- **Duplicate Request**: "A pending connection request already exists"
- **Already Connected**: "An active connection already exists"
- **404 Errors**: Target organization not found
- **Permission Errors**: User lacks admin role

## Security

- Role-based access control (admin roles only)
- Organization isolation (can only see own connections)
- JWT authentication required
- Audit trail maintained for all actions