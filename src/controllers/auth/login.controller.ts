import { Request, Response } from 'express';
import authService from '../../services/auth';
import { UserLoginDTO } from '../../services/auth';
import { handleAuthError, loginErrorMap } from './error-handler';

/**
 * Controller for handling user login
 */
export class LoginController {
  /**
   * Login a user
   */
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      
      // Validate request body
      if (!email || !password) {
        res.status(400).json({ message: 'Email and password are required' });
        return;
      }
      
      const loginData: UserLoginDTO = {
        email,
        password
      };
      
      const result = await authService.login(loginData);
      
      res.status(200).json(result);
    } catch (error) {
      handleAuthError(
        error, 
        res, 
        'Login', 
        loginErrorMap, 
        'An error occurred during login'
      );
    }
  }
}

export default new LoginController();