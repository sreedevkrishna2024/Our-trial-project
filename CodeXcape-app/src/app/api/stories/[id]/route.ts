import { NextRequest, NextResponse } from 'next/server'

// Temporary in-memory storage (shared with stories route)
const stories: any[] = []

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const storyId = params.id

    const story = stories.find(s => s.id === storyId)

    if (!story) {
      return NextResponse.json(
        { error: 'Story not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: story
    })

  } catch (error) {
    console.error('Get story error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch story' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const storyId = params.id
    const body = await request.json()
    const { title, description, genre, status, isPublic, targetWordCount, tags } = body

    const storyIndex = stories.findIndex(s => s.id === storyId)
    if (storyIndex === -1) {
      return NextResponse.json(
        { error: 'Story not found' },
        { status: 404 }
      )
    }

    // Update story
    stories[storyIndex] = {
      ...stories[storyIndex],
      ...(title && { title }),
      ...(description !== undefined && { description }),
      ...(genre && { genre }),
      ...(status && { status }),
      ...(isPublic !== undefined && { isPublic }),
      ...(targetWordCount !== undefined && { targetWordCount }),
      ...(tags && { tags }),
      updatedAt: new Date()
    }

    const story = stories[storyIndex]

    return NextResponse.json({
      success: true,
      data: story
    })

  } catch (error) {
    console.error('Update story error:', error)
    return NextResponse.json(
      { error: 'Failed to update story' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const storyId = params.id

    const storyIndex = stories.findIndex(s => s.id === storyId)
    if (storyIndex !== -1) {
      stories.splice(storyIndex, 1)
    }

    return NextResponse.json({
      success: true,
      message: 'Story deleted successfully'
    })

  } catch (error) {
    console.error('Delete story error:', error)
    return NextResponse.json(
      { error: 'Failed to delete story' },
      { status: 500 }
    )
  }
}
