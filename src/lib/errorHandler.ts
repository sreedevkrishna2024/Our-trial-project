import { NextResponse } from 'next/server'
import { ZodError } from 'zod'

// Error types
export enum Errors {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  RATE_LIMITED = 'RATE_LIMITED',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  AI_SERVICE_ERROR = 'AI_SERVICE_ERROR',
  EXTERNAL_API_ERROR = 'EXTERNAL_API_ERROR',
  BAD_REQUEST = 'BAD_REQUEST',
  CONFLICT = 'CONFLICT',
  UNPROCESSABLE_ENTITY = 'UNPROCESSABLE_ENTITY'
}

// Error interface
export interface ApiError {
  message: string
  code: Errors
  details?: any
  stack?: string
}

// Error handler function
export function handleApiError(error: unknown): NextResponse {
  console.error('API Error:', error)

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'Validation failed',
          code: Errors.VALIDATION_ERROR,
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
            code: err.code
          }))
        }
      },
      { status: 400 }
    )
  }

  // Handle Prisma errors
  if (error && typeof error === 'object' && 'code' in error) {
    const prismaError = error as any
    
    switch (prismaError.code) {
      case 'P2002':
        return NextResponse.json(
          {
            success: false,
            error: {
              message: 'A record with this information already exists',
              code: Errors.CONFLICT,
              details: { field: prismaError.meta?.target }
            }
          },
          { status: 409 }
        )
      
      case 'P2025':
        return NextResponse.json(
          {
            success: false,
            error: {
              message: 'Record not found',
              code: Errors.NOT_FOUND,
              details: { model: prismaError.meta?.model_name }
            }
          },
          { status: 404 }
        )
      
      case 'P2003':
        return NextResponse.json(
          {
            success: false,
            error: {
              message: 'Foreign key constraint failed',
              code: Errors.VALIDATION_ERROR,
              details: { field: prismaError.meta?.field_name }
            }
          },
          { status: 400 }
        )
      
      default:
        return NextResponse.json(
          {
            success: false,
            error: {
              message: 'Database operation failed',
              code: Errors.DATABASE_ERROR,
              details: { code: prismaError.code }
            }
          },
          { status: 500 }
        )
    }
  }

  // Handle standard Error objects
  if (error instanceof Error) {
    // Check for specific error messages
    if (error.message.includes('rate limit')) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Rate limit exceeded',
            code: Errors.RATE_LIMITED,
            details: { message: error.message }
          }
        },
        { status: 429 }
      )
    }

    if (error.message.includes('authentication') || error.message.includes('unauthorized')) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Authentication required',
            code: Errors.AUTHENTICATION_ERROR,
            details: { message: error.message }
          }
        },
        { status: 401 }
      )
    }

    if (error.message.includes('forbidden') || error.message.includes('permission')) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Access denied',
            code: Errors.AUTHORIZATION_ERROR,
            details: { message: error.message }
          }
        },
        { status: 403 }
      )
    }

    if (error.message.includes('not found')) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Resource not found',
            code: Errors.NOT_FOUND,
            details: { message: error.message }
          }
        },
        { status: 404 }
      )
    }

    if (error.message.includes('AI') || error.message.includes('Gemini')) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'AI service temporarily unavailable',
            code: Errors.AI_SERVICE_ERROR,
            details: { message: error.message }
          }
        },
        { status: 503 }
      )
    }

    // Generic error
    return NextResponse.json(
      {
        success: false,
        error: {
          message: error.message || 'An unexpected error occurred',
          code: Errors.INTERNAL_SERVER_ERROR,
          details: { message: error.message }
        }
      },
      { status: 500 }
    )
  }

  // Handle unknown error types
  return NextResponse.json(
    {
      success: false,
      error: {
        message: 'An unexpected error occurred',
        code: Errors.INTERNAL_SERVER_ERROR,
        details: { error: String(error) }
      }
    },
    { status: 500 }
  )
}

// Helper function to create custom errors
export function createApiError(
  message: string,
  code: Errors,
  details?: any,
  status: number = 500
): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: {
        message,
        code,
        details
      }
    },
    { status }
  )
}

// Helper function to create success responses
export function createSuccessResponse(data: any, status: number = 200): NextResponse {
  return NextResponse.json(
    {
      success: true,
      data
    },
    { status }
  )
}

// Helper function to create paginated responses
export function createPaginatedResponse(
  data: any[],
  page: number,
  limit: number,
  total: number,
  status: number = 200
): NextResponse {
  return NextResponse.json(
    {
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    },
    { status }
  )
}

// Helper function to validate request body
export function validateRequestBody<T>(body: any, schema: any): T {
  try {
    return schema.parse(body)
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`)
    }
    throw error
  }
}

// Helper function to check required fields
export function checkRequiredFields(data: any, requiredFields: string[]): void {
  const missingFields = requiredFields.filter(field => !data[field])
  
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`)
  }
}

// Helper function to sanitize error messages for production
export function sanitizeError(error: any, isProduction: boolean = false): any {
  if (isProduction) {
    return {
      message: 'An error occurred',
      code: error.code || Errors.INTERNAL_SERVER_ERROR
    }
  }
  
  return error
}

// Helper function to log errors with context
export function logError(error: any, context: string = 'API'): void {
  console.error(`[${context}] Error:`, {
    message: error.message,
    code: error.code,
    stack: error.stack,
    timestamp: new Date().toISOString()
  })
}

// Helper function to create error response with logging
export function handleErrorWithLogging(
  error: any,
  context: string = 'API',
  isProduction: boolean = false
): NextResponse {
  logError(error, context)
  const sanitizedError = sanitizeError(error, isProduction)
  return handleApiError(sanitizedError)
}