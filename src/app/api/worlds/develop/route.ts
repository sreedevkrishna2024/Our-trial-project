import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { vectorService } from '@/lib/vectorService'
import { geminiAI } from '@/lib/geminiService'

// Temporary in-memory storage
const worlds: any[] = []
const developments: any[] = []

export async function POST(request: NextRequest) {
  try {
    // For testing purposes, allow requests without authentication
    const session = await getServerSession(authOptions)
    const userId = (session?.user as any)?.id || 'test-user-1'

    const { worldId, query, developmentType } = await request.json()

    if (!worldId || !query) {
      return NextResponse.json({ 
        success: false, 
        error: 'World ID and query are required' 
      }, { status: 400 })
    }

    // Get the world from memory storage
    const world = worlds.find(w => w.id === worldId && w.userId === userId)

    if (!world) {
      return NextResponse.json({ 
        success: false, 
        error: 'World not found' 
      }, { status: 404 })
    }

    // For now, skip loading existing embeddings
    // In production, you'd load embeddings from the database

    // Retrieve relevant context using RAG
    const context = await vectorService.retrieveContext(worldId, query, 5)

    // Generate development suggestions based on context
    let developmentContent = ''
    let suggestions: string[] = []

    switch (developmentType) {
      case 'character':
        developmentContent = await geminiAI.generateCharacterDevelopment(
          query, 
          context.contextSummary, 
          world.genre
        )
        break
      case 'location':
        developmentContent = await geminiAI.generateLocationDevelopment(
          query, 
          context.contextSummary, 
          world.genre
        )
        break
      case 'culture':
        developmentContent = await geminiAI.generateCulturalDevelopment(
          query, 
          context.contextSummary, 
          world.genre
        )
        break
      case 'history':
        developmentContent = await geminiAI.generateHistoricalDevelopment(
          query, 
          context.contextSummary, 
          world.genre
        )
        break
      case 'magic':
        developmentContent = await geminiAI.generateMagicSystemDevelopment(
          query, 
          context.contextSummary, 
          world.genre
        )
        break
      case 'politics':
        developmentContent = await geminiAI.generatePoliticalDevelopment(
          query, 
          context.contextSummary, 
          world.genre
        )
        break
      default:
        developmentContent = await geminiAI.generateGeneralWorldDevelopment(
          query, 
          context.contextSummary, 
          world.genre
        )
    }

    suggestions = context.suggestions

    // Store the development in memory
    const development = {
      id: Date.now().toString(),
      worldId,
      query,
      developmentType: developmentType || 'general',
      content: developmentContent,
      context: context.contextSummary,
      suggestions: JSON.stringify(suggestions),
      userId: userId,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    developments.push(development)

    return NextResponse.json({
      success: true,
      data: {
        development: developmentContent,
        suggestions,
        context: context.contextSummary,
        relevantSections: context.relevantSections.map((section: any) => ({
          type: section.type,
          section: section.metadata.section,
          content: section.content.substring(0, 200) + '...',
          similarity: section.similarity || 0
        }))
      }
    })

  } catch (error) {
    console.error('Error in world development:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to develop world' 
    }, { status: 500 })
  }
}
