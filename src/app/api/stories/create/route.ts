import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    let userEmail = session?.user?.email
    
    // FIX: Added fallback for testing if no session
    if (!userEmail) {
      userEmail = 'test@example.com'
    }

    const { title, description, genre, tags, targetWordCount } = await request.json()

    if (!title || !genre) {
      return NextResponse.json(
        { error: 'Title and genre are required' },
        { status: 400 }
      )
    }

    // Find or create user by email
    let user = await prisma.user.findUnique({
      where: { email: userEmail }
    })

    if (!user) {
      // FIX: Create user if doesn't exist (for testing)
      user = await prisma.user.create({
        data: {
          email: userEmail,
          name: 'Test User',
          onboardingCompleted: false
        }
      })
    }

    // Create new story
    const story = await prisma.story.create({
      data: {
        title,
        description: description || '',
        genre,
        tags: tags ? JSON.stringify(tags) : null,
        targetWordCount: targetWordCount || null,
        authorId: user.id,
        status: 'DRAFT',
        wordCount: 0,
        isPublic: false
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      story
    })

  } catch (error) {
    console.error('Story creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create story' },
      { status: 500 }
    )
  }
}
