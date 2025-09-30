import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const userEmail = session?.user?.email || 'test@example.com'

    // Get or create user
    let user = await prisma.user.findUnique({
      where: { email: userEmail }
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: userEmail,
          name: session?.user?.name || 'Test User',
          onboardingCompleted: true
        }
      })
    }

    // Calculate real statistics
    const [
      totalStories,
      totalCharacters,
      totalPlots,
      totalWorlds,
      totalAIGenerations,
      totalWords,
      storiesThisWeek,
      storiesThisMonth
    ] = await Promise.all([
      prisma.story.count({ where: { authorId: user.id } }),
      prisma.savedCharacter.count({ where: { userId: user.id } }),
      prisma.savedPlot.count({ where: { userId: user.id } }),
      prisma.world.count({ where: { userId: user.id } }),
      prisma.aIGeneration.count({ where: { userId: user.id } }),
      prisma.story.aggregate({
        where: { authorId: user.id },
        _sum: { wordCount: true }
      }),
      prisma.story.count({
        where: {
          authorId: user.id,
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      }),
      prisma.story.count({
        where: {
          authorId: user.id,
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        }
      })
    ])

    // Calculate word counts for this week and month
    const wordsThisWeek = await prisma.story.aggregate({
      where: {
        authorId: user.id,
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      },
      _sum: { wordCount: true }
    })

    const wordsThisMonth = await prisma.story.aggregate({
      where: {
        authorId: user.id,
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        }
      },
      _sum: { wordCount: true }
    })

    // Get most used AI generation type
    const mostUsedType = await prisma.aIGeneration.groupBy({
      by: ['type'],
      where: { userId: user.id },
      _count: { type: true },
      orderBy: { _count: { type: 'desc' } },
      take: 1
    })

    // Calculate writing streak (simplified - in real app, you'd track daily writing)
    const currentStreak = Math.min(totalAIGenerations, 30) // Simplified calculation
    const longestStreak = Math.max(totalAIGenerations, 1)

    // Calculate average words per day (last 30 days)
    const daysInMonth = 30
    const averageWordsPerDay = Math.round((wordsThisMonth._sum?.wordCount || 0) / daysInMonth)

    const stats = {
      totalWords: totalWords._sum?.wordCount || 0,
      totalStories,
      totalCharacters,
      totalPlots,
      totalWorlds,
      totalAIGenerations,
      thisWeekWords: wordsThisWeek._sum?.wordCount || 0,
      thisMonthWords: wordsThisMonth._sum?.wordCount || 0,
      averageWordsPerDay,
      longestStreak,
      currentStreak,
      mostProductiveDay: 'Monday', // This would require more complex calculation
      mostUsedFeature: mostUsedType[0]?.type || 'story_idea',
      writingGoals: {
        daily: 500,
        weekly: 3500,
        monthly: 15000
      },
      achievements: [
        {
          id: 'first-story',
          name: 'First Steps',
          description: 'Write your first story',
          icon: '📝',
          unlocked: totalStories > 0,
          unlockedAt: totalStories > 0 ? new Date().toISOString() : undefined
        },
        {
          id: 'word-master',
          name: 'Word Master',
          description: 'Write 10,000 words',
          icon: '📚',
          unlocked: (totalWords._sum?.wordCount || 0) >= 10000,
          unlockedAt: (totalWords._sum?.wordCount || 0) >= 10000 ? new Date().toISOString() : undefined
        },
        {
          id: 'ai-helper',
          name: 'AI Assistant',
          description: 'Use AI generation 50 times',
          icon: '🤖',
          unlocked: totalAIGenerations >= 50,
          unlockedAt: totalAIGenerations >= 50 ? new Date().toISOString() : undefined
        },
        {
          id: 'world-builder',
          name: 'World Builder',
          description: 'Create 5 detailed worlds',
          icon: '🌍',
          unlocked: totalWorlds >= 5,
          unlockedAt: totalWorlds >= 5 ? new Date().toISOString() : undefined
        },
        {
          id: 'character-creator',
          name: 'Character Creator',
          description: 'Generate 20 characters',
          icon: '👥',
          unlocked: totalCharacters >= 20,
          unlockedAt: totalCharacters >= 20 ? new Date().toISOString() : undefined
        },
        {
          id: 'plot-master',
          name: 'Plot Master',
          description: 'Create 10 plot outlines',
          icon: '📊',
          unlocked: totalPlots >= 10,
          unlockedAt: totalPlots >= 10 ? new Date().toISOString() : undefined
        }
      ]
    }

    return NextResponse.json({
      success: true,
      data: stats
    })

  } catch (error) {
    console.error('Error fetching user stats:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch user statistics',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
