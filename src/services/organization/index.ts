/**
 * Organization service module
 *
 * This module exports all organization-related services
 * 
 * IMPORTANT: We've fixed an issue with the getMyOrganization service where it was
 * trying to query the status column from the users table, which doesn't exist in
 * all environments. See DOCS/database-schema-compatibility.md for details.
 */

// Export the get-my-organization service
import { getMyOrganization } from './get-my-organization.js';

// Export the update-organization-profile service
import { updateOrganizationProfile } from './update-organization-profile.service.js';

// Export the search-organizations service
import { searchOrganizations } from './search-organizations.service.js';

// Export all services
export {
  getMyOrganization,
  updateOrganizationProfile,
  searchOrganizations
};