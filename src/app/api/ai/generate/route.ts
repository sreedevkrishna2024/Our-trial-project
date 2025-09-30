import { NextRequest, NextResponse } from 'next/server'
import { geminiAI } from '@/lib/geminiService'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { aiGenerationSchema } from '@/lib/validation'
import { aiGenerationRateLimit } from '@/lib/rateLimit'
import { handleApiError, Errors } from '@/lib/errorHandler'

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIP = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'unknown'
    
    // Rate limiting check
    const rateLimitResult = await aiGenerationRateLimit.checkLimit(clientIP)
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Too many requests. Please try again later.',
            code: 'RATE_LIMITED',
            details: {
              remaining: rateLimitResult.remaining,
              resetTime: rateLimitResult.resetTime
            }
          }
        },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
            'X-RateLimit-Limit': '10',
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.resetTime.toString()
          }
        }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const validatedData = aiGenerationSchema.parse(body)
    
    const { 
      type, 
      prompt, 
      genre, 
      theme, 
      character1,
      character2,
      context: dialogueContext,
      role,
      userId,
      storyId,
      userMessage,
      storyContext,
      chapterNumber,
      previousChapter,
      focusArea,
      text,
      setting,
      additionalDetails
    } = validatedData

    let result
    
    switch (type) {
      case 'story_idea':
        result = await geminiAI.generateMultipleStoryIdeas(genre, theme)
        break
      case 'plot':
        result = await geminiAI.generatePlotOutline(genre || 'fantasy', theme || 'adventure')
        break
      case 'dialogue':
        result = await geminiAI.generateDialogue(character1 || 'Character 1', character2 || 'Character 2', dialogueContext || '')
        break
      case 'character':
        result = await geminiAI.generateCharacterFromType(character1 || 'protagonist', character2 || '', genre || 'fantasy')
        break
      case 'analyze_style':
        result = await geminiAI.analyzeWritingStyle(prompt || text || '')
        break
      case 'chat':
        result = await geminiAI.generateChatResponse(userMessage || '', dialogueContext || '', prompt || '')
        break
      case 'story_chapter':
        result = await geminiAI.generateStoryChapter(storyContext || '', chapterNumber || 1, previousChapter || '')
        break
      case 'improve_text':
        result = await geminiAI.improveText(text || '', focusArea || 'general')
        break
      case 'world_building':
        result = await geminiAI.generateWorldBuilding(prompt || '', genre || 'fantasy', setting || 'medieval', additionalDetails || '')
        break
      default:
        // For general prompts, use chat response
        result = await geminiAI.generateChatResponse(prompt || userMessage || '', dialogueContext || '')
    }

    // Convert array results to formatted strings for better display
    let formattedResult: string
    if (Array.isArray(result)) {
      formattedResult = result.join('\n\n')
    } else if (typeof result === 'string') {
      formattedResult = result
    } else {
      formattedResult = JSON.stringify(result)
    }

    // Save AI generation to database (try with authentication first, then fallback to test user)
    let savedGeneration = null
    let savedContent = null
    
    try {
      let user = null
      
      // Try to get authenticated user first
      const session = await getServerSession(authOptions)
      if (session?.user?.email) {
        user = await prisma.user.findUnique({
          where: { email: session.user.email }
        })
      }
      
      // If no authenticated user, use test user for saving
      if (!user) {
        user = await prisma.user.upsert({
          where: { email: 'test@example.com' },
          update: {},
          create: {
            email: 'test@example.com',
            name: 'Test User',
            password: 'hashedpassword123'
          }
        })
      }
      
      if (user) {
        // Always save to AIGeneration table
        savedGeneration = await prisma.aIGeneration.create({
          data: {
            type: type || 'GENERAL',
            prompt: prompt || userMessage || 'General prompt',
            generatedContent: formattedResult,
            model: 'gemini-2.5-flash',
            userId: user.id,
            storyId: storyId || null
          }
        })

        // Save to specific content tables based on type
        switch (type) {
        case 'story_idea':
          savedContent = await prisma.storyIdea.create({
            data: {
              title: `AI Generated Story Idea - ${new Date().toLocaleDateString()}`,
              concept: formattedResult,
                genre: genre || 'fantasy',
                themes: JSON.stringify([theme || 'adventure']),
                characters: JSON.stringify([]),
                conflict: 'AI Generated',
                setting: 'AI Generated',
                potential: 'high',
                userId: user.id
              }
            })
            break
            
          case 'character':
            savedContent = await prisma.savedCharacter.create({
              data: {
                name: 'AI Generated Character',
                role: 'AI Generated',
                age: 25,
                description: formattedResult,
                personality: JSON.stringify(['AI Generated']),
                backstory: 'AI Generated',
                motivation: 'AI Generated',
                appearance: 'AI Generated',
                skills: JSON.stringify(['AI Generated']),
                flaws: JSON.stringify(['AI Generated']),
                relationships: JSON.stringify(['AI Generated']),
                userId: user.id
              }
            })
            break
            
          case 'dialogue':
            savedContent = await prisma.savedDialogue.create({
              data: {
                title: `AI Generated Dialogue - ${new Date().toLocaleDateString()}`,
                content: formattedResult,
                characters: JSON.stringify(['AI Generated']),
                setting: 'AI Generated',
                mood: 'AI Generated',
                genre: genre || 'fantasy',
                userId: user.id
              }
            })
            break
            
          case 'plot':
            savedContent = await prisma.savedPlot.create({
              data: {
                title: `AI Generated Plot - ${new Date().toLocaleDateString()}`,
                description: formattedResult,
                plotPoints: JSON.stringify([formattedResult]),
                genre: genre || 'fantasy',
                theme: theme || 'adventure',
                structure: 'AI Generated',
                userId: user.id
              }
            })
            break
            
          case 'world_building':
            savedContent = await prisma.world.create({
              data: {
                name: `AI Generated World - ${new Date().toLocaleDateString()}`,
                description: formattedResult,
                genre: genre || 'fantasy',
                setting: 'AI Generated',
                timePeriod: 'AI Generated',
                magicSystem: 'AI Generated',
                technologyLevel: 'AI Generated',
                politicalSystem: 'AI Generated',
                culture: 'AI Generated',
                geography: 'AI Generated',
                history: 'AI Generated',
                rules: JSON.stringify(['AI Generated']),
                characters: JSON.stringify(['AI Generated']),
                userId: user.id
              }
            })
            break
        }
      }
    } catch (dbError) {
      console.error('Error saving AI generation to database:', dbError)
      // Continue even if database save fails
    }

    return NextResponse.json({
      success: true,
      data: {
        content: formattedResult,
        type,
        timestamp: new Date().toISOString(),
        generationId: savedGeneration?.id,
        contentId: savedContent?.id,
        savedToDatabase: !!(savedGeneration && savedContent)
      }
    })

  } catch (error) {
    return handleApiError(error)
  }
}