import { NextRequest, NextResponse } from 'next/server'

// Temporary in-memory storage
const stories: any[] = []

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, genre, authorId, isPublic, targetWordCount, tags } = body

    if (!title || !authorId) {
      return NextResponse.json(
        { error: 'Title and author ID are required' },
        { status: 400 }
      )
    }

    const story = {
      id: Date.now().toString(),
      title,
      description: description || '',
      genre: genre || 'General',
      authorId,
      isPublic: isPublic || false,
      targetWordCount: targetWordCount || null,
      tags: tags ? JSON.stringify(tags) : null,
      createdAt: new Date(),
      updatedAt: new Date(),
      author: { name: 'User', email: 'user@example.com' },
      _count: {
        chapters: 0,
        characters: 0,
        plots: 0,
        dialogues: 0,
        likes: 0
      }
    }
    
    stories.push(story)

    return NextResponse.json({
      success: true,
      data: story
    })

  } catch (error) {
    console.error('Create story error:', error)
    return NextResponse.json(
      { error: 'Failed to create story' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const authorId = searchParams.get('authorId') 
    const isPublic = searchParams.get('isPublic')
    const genre = searchParams.get('genre')
    const limit = parseInt(searchParams.get('limit') || '20')

    const whereClause: any = {}
    // Support both userId and authorId for backward compatibility
    if (userId) whereClause.authorId = userId
    if (authorId) whereClause.authorId = authorId
    if (isPublic !== null) whereClause.isPublic = isPublic === 'true'
    if (genre) whereClause.genre = genre

    let filteredStories = stories.filter(story => {
      if (userId && story.authorId !== userId) return false
      if (authorId && story.authorId !== authorId) return false
      if (isPublic !== null && story.isPublic !== (isPublic === 'true')) return false
      if (genre && story.genre !== genre) return false
      return true
    })
    
    // Sort by updatedAt desc and limit
    filteredStories = filteredStories
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, limit)

    return NextResponse.json({
      success: true,
      data: filteredStories
    })

  } catch (error) {
    console.error('Get stories error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stories' },
      { status: 500 }
    )
  }
}
