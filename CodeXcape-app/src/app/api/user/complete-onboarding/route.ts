import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Starting onboarding completion...')
    
    const session = await getServerSession(authOptions)
    console.log('Session:', session ? 'Found' : 'Not found')
    
    let userEmail = session?.user?.email
    
    // Fallback for testing if no session
    if (!userEmail) {
      userEmail = 'test@example.com'
      console.log('Using fallback email:', userEmail)
    }

    const {
      writingExperience,
      favoriteGenres,
      writingGoals,
      previousWorks,
      writingStyle,
      interests
    } = await request.json()

    console.log('Received data:', {
      writingExperience,
      favoriteGenres: favoriteGenres?.length,
      writingGoals: writingGoals?.length,
      interests: interests?.length
    })

    // Find or create user by email
    console.log('Looking for user with email:', userEmail)
    let user = await prisma.user.findUnique({
      where: { email: userEmail }
    })
    console.log('User found:', user ? 'Yes' : 'No')

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

    // Update user with onboarding data
    await prisma.user.update({
      where: { id: user.id },
      data: {
        onboardingCompleted: true,
        writingExperience,
        favoriteGenres: JSON.stringify(favoriteGenres),
        writingGoals: JSON.stringify(writingGoals),
        writingStyle: JSON.stringify(writingStyle),
        preferences: JSON.stringify({ interests })
      }
    })

    // Save onboarding responses
    const onboardingData = [
      {
        question: 'Writing Experience',
        answer: writingExperience,
        questionType: 'SURVEY'
      },
      {
        question: 'Favorite Genres',
        answer: favoriteGenres.join(', '),
        questionType: 'PREFERENCE'
      },
      {
        question: 'Writing Goals',
        answer: writingGoals.join(', '),
        questionType: 'SURVEY'
      },
      {
        question: 'Writing Style',
        answer: JSON.stringify(writingStyle),
        questionType: 'SURVEY'
      },
      {
        question: 'Interests',
        answer: interests.join(', '),
        questionType: 'PREFERENCE'
      }
    ]

    if (previousWorks) {
      onboardingData.push({
        question: 'Previous Works',
        answer: previousWorks,
        questionType: 'FILE_UPLOAD'
      })
    }

    // Save onboarding data
    for (const data of onboardingData) {
      await prisma.userOnboardingData.create({
        data: {
          question: data.question,
          answer: data.answer,
          questionType: data.questionType,
          userId: user.id
        }
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Onboarding completed successfully'
    })

  } catch (error) {
    console.error('Complete onboarding error:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : 'Unknown'
    })
    return NextResponse.json(
      { 
        error: 'Failed to complete onboarding',
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}
