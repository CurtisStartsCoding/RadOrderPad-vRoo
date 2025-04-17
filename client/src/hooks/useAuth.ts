import { useState, useEffect } from 'react';

/**
 * User interface
 */
export interface User {
  /** User ID */
  id: string;
  
  /** User name */
  name: string;
  
  /** User email */
  email: string;
  
  /** User role */
  role: 'physician' | 'admin_staff' | 'radiology_staff' | 'admin';
}

/**
 * Authentication hook
 * 
 * This is a mock implementation for development purposes.
 * In a real application, this would connect to an authentication service.
 */
export const useAuth = () => {
  // Mock user state
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Simulate loading user on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock user data (in a real app, this would come from an API)
        const mockUser: User = {
          id: '123',
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'admin_staff'
        };
        
        setUser(mockUser);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load user'));
        setIsLoading(false);
      }
    };
    
    loadUser();
  }, []);
  
  /**
   * Login function
   */
  const login = async (email: string, password: string): Promise<User> => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock login logic (in a real app, this would call an API)
      if (email === 'admin@example.com' && password === 'password') {
        const user: User = {
          id: '123',
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'admin_staff'
        };
        
        setUser(user);
        setIsLoading(false);
        return user;
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Login failed'));
      setIsLoading(false);
      throw err;
    }
  };
  
  /**
   * Logout function
   */
  const logout = async (): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Clear user state
      setUser(null);
      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Logout failed'));
      setIsLoading(false);
      throw err;
    }
  };
  
  return {
    user,
    isLoading,
    error,
    login,
    logout
  };
};