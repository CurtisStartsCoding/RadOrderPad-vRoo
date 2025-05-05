import { Request, Response, NextFunction } from 'express';
import { getRedisClient } from '../../config/redis';
import enhancedLogger from '../../utils/enhanced-logger';

/**
 * Creates a rate limiter middleware with the specified parameters
 * @param limit Maximum number of requests allowed within the duration
 * @param durationSeconds Duration in seconds for the rate limit window
 * @param identifier Function to generate a unique key for the request
 * @returns Express middleware function
 */
export function createRateLimiter(
  limit: number,
  durationSeconds: number,
  identifier: (req: Request) => string
) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
    try {
      const client = getRedisClient();
      const key = identifier(req);
      const rateKey = `ratelimit:${key}`;
      
      // Use pipeline for atomic operations
      const pipeline = client.pipeline();
      
      // Increment the counter
      pipeline.incr(rateKey);
      
      // Get the current timestamp
      pipeline.get(`${rateKey}:timestamp`);
      
      // Execute the pipeline
      const results = await pipeline.exec();
      
      if (!results) {
        enhancedLogger.error('Redis pipeline execution failed in rate limiter');
        return next(); // Continue on error
      }
      
      const currentCount = results[0][1] as number;
      const lastRequestTime = results[1][1] ? parseInt(results[1][1] as string) : 0;
      const now = Date.now();
      
      // First request or expired window
      if (currentCount === 1 || now - lastRequestTime > durationSeconds * 1000) {
        // Set the timestamp and expiration
        await client.pipeline()
          .set(`${rateKey}:timestamp`, now.toString())
          .expire(rateKey, durationSeconds)
          .expire(`${rateKey}:timestamp`, durationSeconds)
          .exec();
          
        return next();
      }
      
      // Check if the limit has been exceeded
      if (currentCount > limit) {
        // Calculate retry-after time in seconds
        const retryAfter = Math.ceil((durationSeconds * 1000 - (now - lastRequestTime)) / 1000);
        
        // Track rate limit events for analytics
        try {
          await client.xadd(
            'stream:ratelimit:events',
            '*',
            'key', key,
            'endpoint', req.originalUrl,
            'timestamp', now.toString()
          );
        } catch (error) {
          enhancedLogger.error('Failed to track rate limit event', { error });
        }
        
        // Return 429 Too Many Requests
        return res.status(429).set({
          'Retry-After': retryAfter.toString()
        }).json({
          error: 'Too many requests',
          message: `Rate limit exceeded. Try again in ${retryAfter} seconds.`,
          retryAfter
        });
      }
      
      // Update timestamp for subsequent requests
      if (currentCount > 1) {
        await client.set(`${rateKey}:timestamp`, now.toString());
      }
      
      next();
    } catch (error) {
      enhancedLogger.error('Error in rate limiter middleware', { 
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        path: req.path
      });
      
      // Continue on error
      next();
    }
  };
}