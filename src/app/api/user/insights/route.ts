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

    // Get AI generation insights
    const [
      recentGenerations,
      generationTypes,
      weeklyGenerations,
      monthlyGenerations,
      topGenres
    ] = await Promise.all([
      // Recent AI generations
      prisma.aIGeneration.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: {
          story: {
            select: { title: true }
          }
        }
      }),
      // Generation types breakdown
      prisma.aIGeneration.groupBy({
        by: ['type'],
        where: { userId: user.id },
        _count: { type: true },
        orderBy: { _count: { type: 'desc' } }
      }),
      // Weekly generations
      prisma.aIGeneration.count({
        where: {
          userId: user.id,
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      }),
      // Monthly generations
      prisma.aIGeneration.count({
        where: {
          userId: user.id,
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        }
      }),
      // Top genres from stories
      prisma.story.groupBy({
        by: ['genre'],
        where: { authorId: user.id },
        _count: { genre: true },
        orderBy: { _count: { genre: 'desc' } },
        take: 5
      })
    ])

    // Calculate AI usage patterns
    const totalGenerations = generationTypes.reduce((sum, type) => sum + type._count.type, 0)
    const mostUsedType = generationTypes[0]?.type || 'story_idea'
    const aiUsageRate = totalGenerations > 0 ? (totalGenerations / 30) : 0 // Generations per day

    // Generate insights based on data
    const insights = []
    
    if (totalGenerations === 0) {
      insights.push({
        type: 'info',
        title: 'Welcome to AI Writing!',
        message: 'Start using AI features to get personalized insights about your writing patterns.',
        icon: '🤖'
      })
    } else if (totalGenerations < 5) {
      insights.push({
        type: 'tip',
        title: 'Explore AI Features',
        message: `You've used AI ${totalGenerations} times. Try different generation types to discover what works best for you.`,
        icon: '💡'
      })
    } else if (aiUsageRate > 2) {
      insights.push({
        type: 'success',
        title: 'AI Power User!',
        message: `You're using AI ${aiUsageRate.toFixed(1)} times per day on average. Great engagement!`,
        icon: '🚀'
      })
    }

    if (generationTypes.length > 0) {
      const diversity = generationTypes.length
      if (diversity >= 5) {
        insights.push({
          type: 'success',
          title: 'Diverse AI Usage',
          message: `You're using ${diversity} different AI features. This shows great exploration!`,
          icon: '🎯'
        })
      } else if (diversity < 3) {
        insights.push({
          type: 'tip',
          title: 'Try More Features',
          message: `You've used ${diversity} AI features. Explore character creation, world building, and plot development!`,
          icon: '🔍'
        })
      }
    }

    if (topGenres.length > 0) {
      const topGenre = topGenres[0]
      insights.push({
        type: 'info',
        title: 'Genre Preference',
        message: `Your favorite genre is ${topGenre.genre} (${topGenre._count.genre} stories).`,
        icon: '📚'
      })
    }

    // Calculate productivity trends
    const productivityTrend = weeklyGenerations > monthlyGenerations / 4 ? 'increasing' : 'stable'
    
    const insightsData = {
      totalGenerations,
      weeklyGenerations,
      monthlyGenerations,
      mostUsedType,
      aiUsageRate: Math.round(aiUsageRate * 10) / 10,
      generationTypes: generationTypes.map(type => ({
        type: type.type,
        count: type._count.type,
        percentage: Math.round((type._count.type / totalGenerations) * 100)
      })),
      topGenres: topGenres.map(genre => ({
        genre: genre.genre,
        count: genre._count?.genre || 0
      })),
      recentGenerations: recentGenerations.map(gen => ({
        id: gen.id,
        type: gen.type,
        createdAt: gen.createdAt,
        storyTitle: gen.story?.title || 'General Generation'
      })),
      insights,
      productivityTrend,
      recommendations: [
        totalGenerations < 10 ? 'Try generating story ideas to get started' : null,
        generationTypes.find(t => t.type === 'character')?.type ? null : 'Explore character creation',
        generationTypes.find(t => t.type === 'world_building')?.type ? null : 'Try world building features',
        weeklyGenerations < 2 ? 'Consider using AI more regularly for better insights' : null
      ].filter(Boolean)
    }

    return NextResponse.json({
      success: true,
      data: insightsData
    })

  } catch (error) {
    console.error('Error fetching AI insights:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch AI insights',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
