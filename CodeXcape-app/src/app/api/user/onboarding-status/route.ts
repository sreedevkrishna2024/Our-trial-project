import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    let userEmail = session?.user?.email
    
    // Fallback for testing if no session
    if (!userEmail) {
      userEmail = 'test@example.com'
    }

    // Find or create user by email
    let user = await prisma.user.findUnique({
      where: { email: userEmail }
    })

    if (!user) {
      // Create user if doesn't exist (for testing)
      user = await prisma.user.create({
        data: {
          email: userEmail,
          name: 'Test User',
          onboardingCompleted: false
        }
      })
    }

    return NextResponse.json({
      completed: user.onboardingCompleted
    })

  } catch (error) {
    console.error('Onboarding status check error:', error)
    return NextResponse.json(
      { error: 'Failed to check onboarding status' },
      { status: 500 }
    )
  }
}
