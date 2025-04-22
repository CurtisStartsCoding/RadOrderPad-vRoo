/**
 * Enhanced logger for cross-platform compatibility
 * Uses Winston for structured logging but also falls back to console methods
 * to ensure compatibility with all environments including Vercel and AWS
 */
import logger from './logger';

/**
 * Enhanced logger that uses both Winston and console methods
 * This ensures logs are captured in all environments
 */
const enhancedLogger = {
  /**
   * Log an error message
   * @param message The message to log
   * @param meta Additional metadata
   */
  error: (message: string | any, ...meta: any[]): void => {
    // Use Winston logger
    logger.error(message, ...meta);
    
    // Also use console.error as fallback for environments where Winston might not work
    console.error(message, ...meta);
  },

  /**
   * Log a warning message
   * @param message The message to log
   * @param meta Additional metadata
   */
  warn: (message: string | any, ...meta: any[]): void => {
    // Use Winston logger
    logger.warn(message, ...meta);
    
    // Also use console.warn as fallback
    console.warn(message, ...meta);
  },

  /**
   * Log an info message
   * @param message The message to log
   * @param meta Additional metadata
   */
  info: (message: string | any, ...meta: any[]): void => {
    // Use Winston logger
    logger.info(message, ...meta);
    
    // Also use console.info as fallback
    console.info(message, ...meta);
  },

  /**
   * Log a debug message
   * @param message The message to log
   * @param meta Additional metadata
   */
  debug: (message: string | any, ...meta: any[]): void => {
    // Use Winston logger
    logger.debug(message, ...meta);
    
    // Also use console.debug as fallback
    console.debug(message, ...meta);
  },

  /**
   * Log a message at any level
   * @param level The log level
   * @param message The message to log
   * @param meta Additional metadata
   */
  log: (level: string, message: string | any, ...meta: any[]): void => {
    // Use Winston logger if the level is supported
    if (level in logger) {
      (logger as any)[level](message, ...meta);
    }
    
    // Also use console.log as fallback
    console.log(`[${level.toUpperCase()}]`, message, ...meta);
  }
};

export default enhancedLogger;