/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { Response } from 'express';
import { updateOrganizationProfile, UpdateOrganizationParams } from '../../services/organization/update-organization-profile.service.js';
import {
  AuthenticatedRequest,
  ControllerHandler,
  checkAuthentication,
  handleControllerError
} from './types.js';
import enhancedLogger from '../../utils/enhanced-logger.js';

/**
 * Validates the update data for an organization
 * @param updateData The data to validate
 * @returns Object with validation result and error message if any
 */
function validateUpdateData(updateData: any): { isValid: boolean; message?: string } {
  // Check if updateData is an object
  if (!updateData || typeof updateData !== 'object') {
    return { isValid: false, message: 'Update data must be an object' };
  }

  // Check if there are any valid fields to update
  const validFields = [
    'name', 'npi', 'tax_id', 'address_line1', 'address_line2', 'city', 'state', 
    'zip_code', 'phone_number', 'fax_number', 'contact_email', 'website', 'logo_url'
  ];
  
  const hasValidField = Object.keys(updateData).some(key => validFields.includes(key));
  if (!hasValidField) {
    return { isValid: false, message: 'No valid fields provided for update' };
  }

  // Validate name if provided (required field)
  if (updateData.name !== undefined) {
    if (typeof updateData.name !== 'string' || updateData.name.trim() === '') {
      return { isValid: false, message: 'Organization name cannot be empty' };
    }
  }

  // Validate email format if provided
  if (updateData.contact_email !== undefined && updateData.contact_email !== null && updateData.contact_email !== '') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(updateData.contact_email)) {
      return { isValid: false, message: 'Invalid email format' };
    }
  }

  // Validate website URL format if provided
  if (updateData.website !== undefined && updateData.website !== null && updateData.website !== '') {
    try {
      // Check if it's a valid URL
      new URL(updateData.website);
    } catch (error) {
      return { isValid: false, message: 'Invalid website URL format' };
    }
  }

  // All validations passed
  return { isValid: true };
}

/**
 * Update the authenticated user's organization profile
 * @param req Express request object
 * @param res Express response object
 */
export const updateMyOrganizationController: ControllerHandler = async (
  req: AuthenticatedRequest, 
  res: Response
): Promise<void> => {
  try {
    // Check if user is authenticated
    if (!checkAuthentication(req, res)) {
      return;
    }
    
    const orgId = req.user!.orgId;
    enhancedLogger.debug(`Updating organization profile for organization ID: ${orgId}`);
    
    // Extract allowed fields from request body
    const {
      id, 
      type, 
      status, 
      credit_balance, 
      billing_id, 
      subscription_tier, 
      assigned_account_manager_id,
      ...updateData
    } = req.body;
    
    // Validate the update data
    const validation = validateUpdateData(updateData);
    if (!validation.isValid) {
      enhancedLogger.debug(`Invalid update data: ${validation.message}`, { updateData });
      res.status(400).json({ 
        success: false, 
        message: validation.message || 'Invalid update data' 
      });
      return;
    }
    
    // Call the service to update the organization profile
    const result = await updateOrganizationProfile(orgId, updateData as UpdateOrganizationParams);
    
    if (!result) {
      enhancedLogger.debug(`Organization with ID ${orgId} not found`);
      res.status(404).json({ 
        success: false, 
        message: 'Organization not found' 
      });
      return;
    }
    
    enhancedLogger.debug(`Successfully updated organization profile for organization ID: ${orgId}`);
    res.status(200).json({
      success: true,
      message: 'Organization profile updated successfully',
      data: result
    });
  } catch (error: unknown) {
    handleControllerError(res, error, 'Failed to update organization profile');
  }
};

export default updateMyOrganizationController;