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

    // Get progress data for the last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

    // Get daily progress data
    const dailyProgress = await prisma.story.findMany({
      where: {
        authorId: user.id,
        createdAt: {
          gte: thirtyDaysAgo
        }
      },
      select: {
        createdAt: true,
        wordCount: true,
        title: true
      },
      orderBy: { createdAt: 'asc' }
    })

    // Get AI generation progress
    const aiProgress = await prisma.aIGeneration.findMany({
      where: {
        userId: user.id,
        createdAt: {
          gte: thirtyDaysAgo
        }
      },
      select: {
        createdAt: true,
        type: true
      },
      orderBy: { createdAt: 'asc' }
    })

    // Calculate weekly progress
    const weeklyStories = dailyProgress.filter(story => 
      story.createdAt >= sevenDaysAgo
    )
    const weeklyWords = weeklyStories.reduce((sum, story) => sum + (story.wordCount || 0), 0)
    const weeklyAIGenerations = aiProgress.filter(gen => 
      gen.createdAt >= sevenDaysAgo
    ).length

    // Calculate monthly progress
    const monthlyWords = dailyProgress.reduce((sum, story) => sum + (story.wordCount || 0), 0)
    const monthlyAIGenerations = aiProgress.length

    // Group data by day for chart
    const dailyData = []
    for (let i = 29; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
      const dayStart = new Date(date.setHours(0, 0, 0, 0))
      const dayEnd = new Date(date.setHours(23, 59, 59, 999))
      
      const dayStories = dailyProgress.filter(story => 
        story.createdAt >= dayStart && story.createdAt <= dayEnd
      )
      const dayAIGenerations = aiProgress.filter(gen => 
        gen.createdAt >= dayStart && gen.createdAt <= dayEnd
      )
      
      dailyData.push({
        date: dayStart.toISOString().split('T')[0],
        words: dayStories.reduce((sum, story) => sum + (story.wordCount || 0), 0),
        stories: dayStories.length,
        aiGenerations: dayAIGenerations.length,
        aiTypes: dayAIGenerations.map(gen => gen.type)
      })
    }

    // Calculate streaks
    let currentStreak = 0
    let longestStreak = 0
    let tempStreak = 0

    for (let i = dailyData.length - 1; i >= 0; i--) {
      if (dailyData[i].words > 0 || dailyData[i].aiGenerations > 0) {
        tempStreak++
        if (i === dailyData.length - 1) {
          currentStreak = tempStreak
        }
      } else {
        longestStreak = Math.max(longestStreak, tempStreak)
        tempStreak = 0
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak)

    // Calculate goals progress
    const dailyGoal = 500
    const weeklyGoal = 3500
    const monthlyGoal = 15000

    const dailyProgressPercentage = Math.min((weeklyWords / 7) / dailyGoal * 100, 100)
    const weeklyProgressPercentage = Math.min(weeklyWords / weeklyGoal * 100, 100)
    const monthlyProgressPercentage = Math.min(monthlyWords / monthlyGoal * 100, 100)

    // Get recent milestones
    const milestones = []
    
    if (monthlyWords >= 1000) {
      milestones.push({
        id: 'first-1000',
        title: 'First 1,000 Words',
        description: 'You\'ve written your first 1,000 words!',
        achieved: true,
        achievedAt: dailyProgress.find(s => s.wordCount && s.wordCount >= 1000)?.createdAt,
        icon: '🎉'
      })
    }
    
    if (monthlyWords >= 5000) {
      milestones.push({
        id: 'first-5000',
        title: '5,000 Word Milestone',
        description: 'You\'ve reached 5,000 words! Keep going!',
        achieved: true,
        achievedAt: dailyProgress.find(s => s.wordCount && s.wordCount >= 5000)?.createdAt,
        icon: '🚀'
      })
    }
    
    if (monthlyWords >= 10000) {
      milestones.push({
        id: 'first-10000',
        title: '10,000 Word Achievement',
        description: 'Amazing! You\'ve written 10,000 words!',
        achieved: true,
        achievedAt: dailyProgress.find(s => s.wordCount && s.wordCount >= 10000)?.createdAt,
        icon: '🏆'
      })
    }

    if (monthlyAIGenerations >= 10) {
      milestones.push({
        id: 'ai-10',
        title: 'AI Explorer',
        description: 'You\'ve used AI generation 10 times!',
        achieved: true,
        achievedAt: aiProgress[9]?.createdAt,
        icon: '🤖'
      })
    }

    if (monthlyAIGenerations >= 50) {
      milestones.push({
        id: 'ai-50',
        title: 'AI Power User',
        description: 'You\'ve used AI generation 50 times!',
        achieved: true,
        achievedAt: aiProgress[49]?.createdAt,
        icon: '⚡'
      })
    }

    // Add upcoming milestones
    if (monthlyWords < 1000) {
      milestones.push({
        id: 'upcoming-1000',
        title: 'First 1,000 Words',
        description: 'Write 1,000 words to unlock this milestone',
        achieved: false,
        progress: monthlyWords,
        target: 1000,
        icon: '🎯'
      })
    }

    if (monthlyWords < 5000 && monthlyWords >= 1000) {
      milestones.push({
        id: 'upcoming-5000',
        title: '5,000 Word Milestone',
        description: 'Write 5,000 words to unlock this milestone',
        achieved: false,
        progress: monthlyWords,
        target: 5000,
        icon: '🎯'
      })
    }

    const progressData = {
      dailyData,
      weeklyProgress: {
        words: weeklyWords,
        stories: weeklyStories.length,
        aiGenerations: weeklyAIGenerations,
        percentage: weeklyProgressPercentage
      },
      monthlyProgress: {
        words: monthlyWords,
        stories: dailyProgress.length,
        aiGenerations: monthlyAIGenerations,
        percentage: monthlyProgressPercentage
      },
      goals: {
        daily: {
          target: dailyGoal,
          current: Math.round(weeklyWords / 7),
          percentage: dailyProgressPercentage
        },
        weekly: {
          target: weeklyGoal,
          current: weeklyWords,
          percentage: weeklyProgressPercentage
        },
        monthly: {
          target: monthlyGoal,
          current: monthlyWords,
          percentage: monthlyProgressPercentage
        }
      },
      streaks: {
        current: currentStreak,
        longest: longestStreak
      },
      milestones,
      trends: {
        wordsPerDay: dailyData.slice(-7).reduce((sum, day) => sum + day.words, 0) / 7,
        aiPerDay: dailyData.slice(-7).reduce((sum, day) => sum + day.aiGenerations, 0) / 7,
        mostProductiveDay: dailyData.reduce((max, day) => 
          day.words > max.words ? day : max, dailyData[0] || { words: 0, date: '' }
        ).date
      }
    }

    return NextResponse.json({
      success: true,
      data: progressData
    })

  } catch (error) {
    console.error('Error fetching progress data:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch progress data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
