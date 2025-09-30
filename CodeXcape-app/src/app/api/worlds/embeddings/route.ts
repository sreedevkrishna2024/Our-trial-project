import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { vectorService } from '@/lib/vectorService'

// Temporary in-memory storage for embeddings
const embeddings: any[] = []

export async function POST(request: NextRequest) {
  try {
    // For testing purposes, allow requests without authentication
    const session = await getServerSession(authOptions)
    const userId = (session?.user as any)?.id || 'test-user-1'

    const { worldId, worldData } = await request.json()

    if (!worldId || !worldData) {
      return NextResponse.json({ 
        success: false, 
        error: 'World ID and data are required' 
      }, { status: 400 })
    }

    // For now, skip world ownership verification in memory storage
    // In production, you'd verify the world exists and belongs to the user

    // Generate and store embeddings
    await vectorService.storeWorldContent(worldId, worldData)

    // Get the generated embeddings
    const worldEmbeddings = vectorService.getWorldEmbeddings(worldId)

    // Store embeddings in memory
    for (const embedding of worldEmbeddings) {
      embeddings.push({
        id: Date.now().toString() + Math.random(),
        worldId: embedding.worldId,
        content: embedding.content,
        embedding: JSON.stringify(embedding.embedding),
        type: embedding.type,
        section: embedding.metadata.section,
        subsection: embedding.metadata.subsection,
        importance: embedding.metadata.importance,
        createdAt: new Date(),
        updatedAt: new Date()
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        embeddingsCount: worldEmbeddings.length,
        message: 'World embeddings stored successfully'
      }
    })

  } catch (error) {
    console.error('Error storing world embeddings:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to store embeddings' 
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // For testing purposes, allow requests without authentication
    const session = await getServerSession(authOptions)
    const userId = (session?.user as any)?.id || 'test-user-1'

    const { searchParams } = new URL(request.url)
    const worldId = searchParams.get('worldId')

    if (!worldId) {
      return NextResponse.json({ 
        success: false, 
        error: 'World ID is required' 
      }, { status: 400 })
    }

    // Get embeddings for the world
    const worldEmbeddings = embeddings.filter(emb => emb.worldId === worldId)

    return NextResponse.json({
      success: true,
      data: {
        embeddings: worldEmbeddings.map(emb => ({
          id: emb.id,
          type: emb.type,
          section: emb.section,
          subsection: emb.subsection,
          content: emb.content.substring(0, 200) + '...',
          importance: emb.importance,
          createdAt: emb.createdAt
        }))
      }
    })

  } catch (error) {
    console.error('Error fetching world embeddings:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch embeddings' 
    }, { status: 500 })
  }
}
