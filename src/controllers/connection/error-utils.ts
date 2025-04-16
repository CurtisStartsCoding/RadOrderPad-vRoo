import { Response } from 'express';

/**
 * Handle errors in connection controllers
 * @param error The error object
 * @param res Express response object
 * @param controllerName The name of the controller for logging purposes
 */
export function handleConnectionError(error: unknown, res: Response, controllerName: string): void {
  console.error(`Error in ${controllerName} controller:`, error);
  
  if (error instanceof Error) {
    // Handle not found or not authorized errors
    if (error.message.includes('not found') || error.message.includes('not authorized')) {
      res.status(404).json({ message: error.message });
      return;
    }
    
    // Handle other specific error types if needed
    
    // Default error response
    res.status(500).json({ 
      message: `Failed to ${controllerName.toLowerCase()}`, 
      error: error.message 
    });
  } else {
    // Handle unknown errors
    res.status(500).json({ 
      message: `Failed to ${controllerName.toLowerCase()}`, 
      error: 'An unknown error occurred' 
    });
  }
}