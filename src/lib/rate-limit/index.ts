import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

interface RateLimitStore {
  attempts: number;
  firstAttempt: number;
  blockedUntil?: number;
}

// In-memory store for rate limiting (consider Redis for production)
const rateLimitStore = new Map<string, RateLimitStore>();

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.blockedUntil && value.blockedUntil < now) {
      rateLimitStore.delete(key);
    } else if (now - value.firstAttempt > 3600000) { // 1 hour
      rateLimitStore.delete(key);
    }
  }
}, 300000); // 5 minutes

export interface RateLimitConfig {
  max: number; // Maximum number of requests
  window: number; // Time window in milliseconds
  blockDuration?: number; // How long to block after exceeding limit (ms)
  identifier?: (req: NextRequest) => string; // Custom identifier function
}

const defaultConfig: RateLimitConfig = {
  max: 60,
  window: 60000, // 1 minute
  blockDuration: 300000, // 5 minutes
};

/**
 * Get identifier for rate limiting
 */
function getIdentifier(req: NextRequest, customIdentifier?: (req: NextRequest) => string): string {
  if (customIdentifier) {
    return customIdentifier(req);
  }

  // Try to get IP from various headers
  const forwardedFor = req.headers.get('x-forwarded-for');
  const realIp = req.headers.get('x-real-ip');
  const ip = forwardedFor?.split(',')[0].trim() || realIp || 'unknown';
  
  // Hash the IP for privacy
  return crypto.createHash('sha256').update(ip).digest('hex');
}

/**
 * Rate limiting middleware
 */
export async function rateLimit(
  req: NextRequest,
  config: Partial<RateLimitConfig> = {}
): Promise<NextResponse | null> {
  const finalConfig = { ...defaultConfig, ...config };
  const identifier = getIdentifier(req, finalConfig.identifier);
  const now = Date.now();

  // Get or create rate limit data
  let data = rateLimitStore.get(identifier);

  // Check if blocked
  if (data?.blockedUntil && data.blockedUntil > now) {
    const retryAfter = Math.ceil((data.blockedUntil - now) / 1000);
    return NextResponse.json(
      {
        error: 'Too many requests',
        message: `Rate limit exceeded. Please try again in ${retryAfter} seconds.`,
        retryAfter,
      },
      {
        status: 429,
        headers: {
          'Retry-After': retryAfter.toString(),
          'X-RateLimit-Limit': finalConfig.max.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': new Date(data.blockedUntil).toISOString(),
        },
      }
    );
  }

  if (!data) {
    // First request
    data = {
      attempts: 1,
      firstAttempt: now,
    };
    rateLimitStore.set(identifier, data);
  } else {
    // Check if window has passed
    if (now - data.firstAttempt > finalConfig.window) {
      // Reset window
      data.attempts = 1;
      data.firstAttempt = now;
      delete data.blockedUntil;
    } else {
      // Increment attempts
      data.attempts++;
      
      // Check if limit exceeded
      if (data.attempts > finalConfig.max) {
        data.blockedUntil = now + (finalConfig.blockDuration || 300000);
        rateLimitStore.set(identifier, data);
        
        const retryAfter = Math.ceil((finalConfig.blockDuration || 300000) / 1000);
        return NextResponse.json(
          {
            error: 'Too many requests',
            message: `Rate limit exceeded. Please try again in ${retryAfter} seconds.`,
            retryAfter,
          },
          {
            status: 429,
            headers: {
              'Retry-After': retryAfter.toString(),
              'X-RateLimit-Limit': finalConfig.max.toString(),
              'X-RateLimit-Remaining': '0',
              'X-RateLimit-Reset': new Date(data.blockedUntil).toISOString(),
            },
          }
        );
      }
    }
    rateLimitStore.set(identifier, data);
  }

  // Request allowed - return null to continue
  return null;
}

/**
 * Rate limit configurations for different endpoint types
 */
export const rateLimitConfigs = {
  // Strict limit for authentication endpoints
  auth: {
    max: 5,
    window: 60000, // 1 minute
    blockDuration: 900000, // 15 minutes
  },
  
  // Moderate limit for API endpoints
  api: {
    max: 60,
    window: 60000, // 1 minute
    blockDuration: 300000, // 5 minutes
  },
  
  // Relaxed limit for chat endpoints (they make frequent requests)
  chat: {
    max: 120,
    window: 60000, // 1 minute
    blockDuration: 60000, // 1 minute
  },
  
  // Very strict limit for expensive operations
  expensive: {
    max: 10,
    window: 300000, // 5 minutes
    blockDuration: 1800000, // 30 minutes
  },
};

/**
 * Helper to apply rate limiting in API routes
 */
export async function withRateLimit(
  req: NextRequest,
  handler: () => Promise<NextResponse>,
  config: Partial<RateLimitConfig> = rateLimitConfigs.api
): Promise<NextResponse> {
  const rateLimitResponse = await rateLimit(req, config);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }
  return handler();
}