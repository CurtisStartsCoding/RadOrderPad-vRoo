import { Request, Response } from 'express';
import authService from '../../services/auth';
import { UserRegistrationDTO, OrganizationRegistrationDTO } from '../../services/auth';
import { handleAuthError, registrationErrorMap } from './error-handler';
import { validateEmail } from '../../utils/validation';
import { verifyCaptcha } from '../../utils/captcha';

/**
 * Controller for handling organization and user registration
 */
export class RegisterController {
  /**
   * Register a new organization and admin user
   */
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { organization, user, captchaToken } = req.body;
      
      // Validate request body
      if (!organization || !user) {
        res.status(400).json({ message: 'Organization and user data are required' });
        return;
      }
      
      // Validate required fields
      if (!organization.name || !organization.type) {
        res.status(400).json({ message: 'Organization name and type are required' });
        return;
      }
      
      // Validate organization type
      if (organization.type !== 'referring_practice' && organization.type !== 'radiology_group') {
        res.status(400).json({ message: 'Organization type must be either referring_practice or radiology_group' });
        return;
      }
      
      if (!user.email || !user.password || !user.first_name || !user.last_name) {
        res.status(400).json({ message: 'User email, password, first name, and last name are required' });
        return;
      }

      // Validate email format
      if (!validateEmail(user.email)) {
        res.status(400).json({ message: 'Invalid email format' });
        return;
      }
      
      // Validate password strength
      if (user.password.length < 8) {
        res.status(400).json({ message: 'Password must be at least 8 characters long' });
        return;
      }
      
      // Verify CAPTCHA token
      if (!captchaToken) {
        res.status(400).json({ message: 'CAPTCHA verification is required' });
        return;
      }
      
      // Check for test mode
    const isTestMode = req.headers['x-test-mode'] === 'true' || 
                      process.env.NODE_ENV === 'development' || 
                      process.env.TEST_MODE === 'true';
    
    const captchaValid = await verifyCaptcha(captchaToken, isTestMode);
      if (!captchaValid) {
        res.status(400).json({ message: 'CAPTCHA verification failed' });
        return;
      }
      
      const orgData: OrganizationRegistrationDTO = {
        name: organization.name,
        type: organization.type,
        npi: organization.npi,
        tax_id: organization.tax_id,
        address_line1: organization.address_line1,
        address_line2: organization.address_line2,
        city: organization.city,
        state: organization.state,
        zip_code: organization.zip_code,
        phone_number: organization.phone_number,
        fax_number: organization.fax_number,
        contact_email: organization.contact_email,
        website: organization.website
      };
      
      const userData: UserRegistrationDTO = {
        email: user.email,
        password: user.password,
        first_name: user.first_name,
        last_name: user.last_name,
        // role is omitted - will be auto-assigned based on organization type
        npi: user.npi,
        specialty: user.specialty,
        phone_number: user.phone_number
      };
      
      const result = await authService.registerOrganization(orgData, userData);
      
      res.status(201).json(result);
    } catch (error) {
      handleAuthError(
        error, 
        res, 
        'Registration', 
        registrationErrorMap, 
        'An error occurred during registration'
      );
    }
  }
}

export default new RegisterController();