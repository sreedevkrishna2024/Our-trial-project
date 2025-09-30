// Simple in-memory rate limiter
// In production, use Redis or a proper rate limiting service

interface RateLimitEntry {
  count: number
  resetTime: number
}

class RateLimiter {
  private limits: Map<string, RateLimitEntry> = new Map()
  private readonly windowMs: number
  private readonly maxRequests: number

  constructor(windowMs: number = 60000, maxRequests: number = 10) {
    this.windowMs = windowMs
    this.maxRequests = maxRequests
  }

  checkLimit(identifier: string): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now()
    const entry = this.limits.get(identifier)

    if (!entry || now > entry.resetTime) {
      // Create new entry or reset expired entry
      this.limits.set(identifier, {
        count: 1,
        resetTime: now + this.windowMs
      })
      
      return {
        allowed: true,
        remaining: this.maxRequests - 1,
        resetTime: now + this.windowMs
      }
    }

    if (entry.count >= this.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime
      }
    }

    // Increment count
    entry.count++
    this.limits.set(identifier, entry)

    return {
      allowed: true,
      remaining: this.maxRequests - entry.count,
      resetTime: entry.resetTime
    }
  }

  // Clean up expired entries periodically
  cleanup(): void {
    const now = Date.now()
    const keysToDelete: string[] = []
    
    this.limits.forEach((entry, key) => {
      if (now > entry.resetTime) {
        keysToDelete.push(key)
      }
    })
    
    keysToDelete.forEach(key => {
      this.limits.delete(key)
    })
  }
}

// Create rate limiter instances for different endpoints
export const aiGenerationRateLimit = new RateLimiter(60000, 10) // 10 requests per minute
export const authRateLimit = new RateLimiter(300000, 5) // 5 requests per 5 minutes
export const generalRateLimit = new RateLimiter(60000, 30) // 30 requests per minute

// Clean up expired entries every 5 minutes
setInterval(() => {
  aiGenerationRateLimit.cleanup()
  authRateLimit.cleanup()
  generalRateLimit.cleanup()
}, 300000)

// Helper function to get client IP
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const cfConnectingIP = request.headers.get('cf-connecting-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (realIP) {
    return realIP
  }
  
  if (cfConnectingIP) {
    return cfConnectingIP
  }
  
  return 'unknown'
}

// Helper function to create rate limit headers
export function createRateLimitHeaders(
  remaining: number,
  resetTime: number,
  limit: number
): Record<string, string> {
  return {
    'X-RateLimit-Limit': limit.toString(),
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': resetTime.toString(),
    'Retry-After': Math.ceil((resetTime - Date.now()) / 1000).toString()
  }
}

// Helper function to check rate limit and return response if exceeded
export function checkRateLimit(
  rateLimiter: RateLimiter,
  identifier: string,
  limit: number
): { allowed: boolean; response?: Response; remaining: number; resetTime: number } {
  const result = rateLimiter.checkLimit(identifier)
  
  if (!result.allowed) {
    const response = new Response(
      JSON.stringify({
        success: false,
        error: {
          message: 'Rate limit exceeded',
          code: 'RATE_LIMITED',
          details: {
            remaining: result.remaining,
            resetTime: result.resetTime
          }
        }
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          ...createRateLimitHeaders(result.remaining, result.resetTime, limit)
        }
      }
    )
    
    return {
      allowed: false,
      response,
      remaining: result.remaining,
      resetTime: result.resetTime
    }
  }
  
  return {
    allowed: true,
    remaining: result.remaining,
    resetTime: result.resetTime
  }
}

// Export the RateLimiter class for custom instances
export { RateLimiter }