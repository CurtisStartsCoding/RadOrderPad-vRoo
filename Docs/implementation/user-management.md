# User Management Implementation

This document describes the implementation details of the User Management feature in the RadOrderPad application.

## Overview

The User Management feature allows administrators to:

- View a list of all users in the system
- Filter and sort users
- Invite new users to the system
- View and edit user details
- Deactivate users

## Architecture

The User Management feature follows a modular architecture with strict adherence to the Single Responsibility Principle (SRP). Each component, hook, and utility function has a single, well-defined responsibility.

### Directory Structure

```
client/src/features/user-management/
├── components/
│   ├── index.ts
│   ├── UserTable.tsx
│   ├── InviteUserDialog.tsx
│   └── UserDetailDialog.tsx
├── hooks/
│   ├── index.ts
│   └── useUserManagement.ts
├── types/
│   ├── index.ts
│   └── user-types.ts
├── utils/
│   ├── index.ts
│   └── format-utils.ts
├── index.ts
└── README.md
```

### Components

- **UserTable**: Displays a table of users with their details and actions.
- **InviteUserDialog**: A dialog for inviting new users to the system.
- **UserDetailDialog**: A dialog for viewing and editing user details.

### Hooks

- **useUserManagement**: A hook that provides all the functionality for managing users, including:
  - Fetching users
  - Inviting users
  - Updating user details
  - Deactivating users
  - Managing dialog states
  - Filtering and sorting users

### Types

- **User**: Represents a user in the system.
- **UserRole**: Enum of possible user roles.
- **UserStatus**: Enum of possible user statuses.
- **InviteUserRequest**: Request payload for inviting a user.
- **UpdateUserRequest**: Request payload for updating a user.
- **UserFilters**: Filters for the user list.
- **UserSortOptions**: Sort options for the user list.

### Utilities

- **formatRole**: Formats a role for display.
- **formatDate**: Formats a date for display.
- **formatDateWithTime**: Formats a date with time for display.
- **getStatusBadgeVariant**: Gets the appropriate badge variant for a status.
- **getAvailableRoles**: Gets the available roles based on the current user's role.
- **getAvailableStatuses**: Gets the available statuses based on the current status.

## Implementation Details

### UserTable Component

The UserTable component displays a table of users with their details and actions. It uses the Shadcn UI Table component for the table layout and the Badge component for displaying user statuses.

Key features:
- Displays user name, email, role, organization, status, and creation date
- Shows loading state when fetching users
- Shows empty state when no users are found
- Provides actions to view/edit and deactivate users
- Uses the format utilities to format role, date, and status

### InviteUserDialog Component

The InviteUserDialog component displays a dialog for inviting new users to the system. It uses the Shadcn UI Dialog, Input, and Select components.

Key features:
- Form for entering email and selecting role
- Validation for required fields and email format
- Shows loading state when submitting
- Restricts available roles based on the current user's role

### UserDetailDialog Component

The UserDetailDialog component displays a dialog for viewing and editing user details. It uses the Shadcn UI Dialog, Badge, and Select components.

Key features:
- Displays user details
- Allows editing role and status
- Shows loading state when submitting
- Restricts available roles and statuses based on the current user's role and the user's current status
- Only shows save button when changes are made

### useUserManagement Hook

The useUserManagement hook provides all the functionality for managing users. It uses React Query for data fetching and mutations.

Key features:
- Fetches users with filtering and sorting
- Provides mutations for inviting, updating, and deactivating users
- Manages dialog states
- Provides handlers for opening and closing dialogs
- Provides handlers for filtering and sorting users
- Shows toast notifications for success and error states

## API Integration

The User Management feature integrates with the following API endpoints:

- `GET /users`: Fetch users with filtering and sorting
- `POST /users/invite`: Invite a new user
- `PUT /users/:id`: Update a user
- `DELETE /users/:id`: Deactivate a user

## Future Improvements

1. **Split useUserManagement Hook**: The useUserManagement hook could be split into smaller, more focused hooks:
   - useUserList for fetching and filtering users
   - useInviteUser for inviting new users
   - useUpdateUser for updating user details
   - useDeactivateUser for deactivating users

2. **Add Pagination**: Add pagination to the UserTable component for better performance with large user lists.

3. **Add Search**: Add a search input to the UserTable component for easier user finding.

4. **Add Bulk Actions**: Add the ability to perform actions on multiple users at once.

5. **Add User Creation**: Add the ability to create users directly, not just through invitations.

6. **Add User Deletion**: Add the ability to permanently delete users, not just deactivate them.

7. **Add User Import/Export**: Add the ability to import and export users in bulk.

## Conclusion

The User Management feature provides a comprehensive set of tools for managing users in the RadOrderPad application. It follows a modular architecture with strict adherence to the Single Responsibility Principle, making it easy to maintain and extend.