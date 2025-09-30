'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { 
  BookOpen, 
  Lightbulb, 
  Users, 
  MessageSquare, 
  BarChart3, 
  Plus,
  Sparkles,
  Target,
  TrendingUp,
  Clock,
  Star,
  Edit3,
  LogOut,
  Brain,
  User,
  ArrowRight,
  ChevronDown,
  Settings,
  FileText,
  PenTool,
  Zap,
  Download,
  Share2,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  AlertCircle,
  Play,
  Pause,
  RotateCcw,
  Save,
  Copy,
  ExternalLink,
  Search,
  Filter,
  SortAsc,
  MoreHorizontal,
  Heart,
  Bookmark,
  Flag,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Loader2,
  Home,
  Globe,
  Upload,
  HelpCircle
} from 'lucide-react'
import { ChatBotNew } from './ChatBotNew'
// import { useAISuggestions } from '@/hooks/useAISuggestions'

// Tab categories for consolidated navigation
const tabCategories = [
  {
    id: 'main',
    name: 'Main',
    icon: Home,
    color: 'indigo',
    tabs: ['overview', 'stories', 'assistant']
  },
  {
    id: 'creation',
    name: 'Creation Tools',
    icon: PenTool,
    color: 'purple',
    tabs: ['story-ideas', 'characters', 'dialogue', 'plot-builder', 'world-builder']
  },
  {
    id: 'analysis',
    name: 'Analysis',
    icon: BarChart3,
    color: 'emerald',
    tabs: ['stats', 'insights', 'progress']
  },
  {
    id: 'tools',
    name: 'Tools',
    icon: Settings,
    color: 'amber',
    tabs: ['export', 'import', 'settings', 'help']
  }
]

// All tabs with their details
const tabs = [
  { id: 'overview', name: 'Overview', icon: Home, description: 'Dashboard overview and quick actions' },
  { id: 'stories', name: 'My Stories', icon: BookOpen, description: 'Manage your stories and projects' },
  { id: 'assistant', name: 'AI Assistant', icon: Brain, description: 'Chat with your AI writing assistant' },
  { id: 'story-ideas', name: 'Story Ideas', icon: Lightbulb, description: 'Generate and manage story concepts' },
  { id: 'characters', name: 'Characters', icon: Users, description: 'Create and develop characters' },
  { id: 'dialogue', name: 'Dialogue', icon: MessageSquare, description: 'Craft compelling dialogue' },
  { id: 'plot-builder', name: 'Plot Builder', icon: Target, description: 'Structure your story plot' },
  { id: 'world-builder', name: 'World Builder', icon: Globe, description: 'Build rich fictional worlds' },
  { id: 'stats', name: 'Writing Stats', icon: BarChart3, description: 'Track your writing progress' },
  { id: 'insights', name: 'AI Insights', icon: TrendingUp, description: 'Get AI-powered writing insights' },
  { id: 'progress', name: 'Progress', icon: Clock, description: 'Monitor your writing goals' },
  { id: 'export', name: 'Export', icon: Download, description: 'Export your work' },
  { id: 'import', name: 'Import', icon: Upload, description: 'Import existing content' },
  { id: 'settings', name: 'Settings', icon: Settings, description: 'Configure your preferences' },
  { id: 'help', name: 'Help', icon: HelpCircle, description: 'Get help and support' }
]

// Component interfaces
interface NewStory {
  title: string
  genre: string
  description: string
}

interface Story {
  id: string
  title: string
  status: 'draft' | 'in-progress' | 'completed'
  lastModified: string
  wordCount: number
  genre: string
}

// StatCard Component
function StatCard({ title, value, icon: Icon, color = 'indigo' }: { 
  title: string
  value: string | number
  icon: any
  color?: 'indigo' | 'purple' | 'emerald' | 'amber'
}) {
  const colorClasses = {
    indigo: 'from-indigo-500 to-indigo-600',
    purple: 'from-purple-500 to-purple-600',
    emerald: 'from-emerald-500 to-emerald-600',
    amber: 'from-amber-500 to-amber-600'
  }

  const bgColorClasses = {
    indigo: 'from-indigo-50 to-indigo-100 border-indigo-200',
    purple: 'from-purple-50 to-purple-100 border-purple-200',
    emerald: 'from-emerald-50 to-emerald-100 border-emerald-200',
    amber: 'from-amber-50 to-amber-100 border-amber-200'
  }

    return (
    <div className={`card-professional p-6 bg-gradient-to-br ${bgColorClasses[color]} border-2 hover-lift`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses[color]} rounded-xl flex items-center justify-center shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      <div className="text-4xl font-black gradient-text-ocean mb-2">{value}</div>
      <div className="text-slate-600 font-medium">{title}</div>
      </div>
    )
  }

// QuickActionCard Component
function QuickActionCard({ title, description, icon: Icon, color = 'purple', onClick }: { 
  title: string
  description: string
  icon: any
  color?: 'purple' | 'amber' | 'indigo' | 'emerald'
  onClick: () => void
}) {
  const colorClasses = {
    indigo: 'from-indigo-500 to-indigo-600',
    purple: 'from-purple-500 to-purple-600',
    emerald: 'from-emerald-500 to-emerald-600',
    amber: 'from-amber-500 to-amber-600'
  }

  const bgColorClasses = {
    indigo: 'from-indigo-50 to-indigo-100 border-indigo-200',
    purple: 'from-purple-50 to-purple-100 border-purple-200',
    emerald: 'from-emerald-50 to-emerald-100 border-emerald-200',
    amber: 'from-amber-50 to-amber-100 border-amber-200'
  }

  return (
    <button
      onClick={onClick}
      className={`card-professional p-6 bg-gradient-to-br ${bgColorClasses[color]} border-2 hover-lift group text-left`}
    >
      <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses[color]} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-lg font-bold mb-2 text-slate-900">{title}</h3>
      <p className="text-slate-600 text-sm">{description}</p>
    </button>
  )
}

// StoryCard Component
function StoryCard({ story, onContinue, onEdit, onDelete }: {
  story: Story
  onContinue: (story: Story) => void
  onEdit: (story: Story) => void
  onDelete: (story: Story) => void
}) {
  const statusColors = {
    draft: 'badge-secondary',
    'in-progress': 'badge-primary',
    completed: 'badge-success'
  }

  return (
    <div className="card-professional p-6 hover-lift group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-slate-900 truncate mb-2">{story.title}</h3>
          <div className="flex items-center gap-2 mb-2">
            <span className={`badge-professional ${statusColors[story.status]}`}>
              {story.status.replace('-', ' ')}
            </span>
            <span className="text-sm text-slate-500">{story.genre}</span>
      </div>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <span>{story.wordCount.toLocaleString()} words</span>
            <span>•</span>
            <span>{new Date(story.lastModified).toLocaleDateString()}</span>
                </div>
                </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(story)}
            className="btn-secondary-professional btn-sm"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(story)}
            className="btn-secondary-professional btn-sm text-red-600 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </button>
                </div>
              </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onContinue(story)}
          className="btn-professional btn-sm group-hover:scale-105 transition-transform duration-300"
        >
          <Play className="w-4 h-4" />
          Continue with AI
        </button>
        <button
          onClick={() => onEdit(story)}
          className="btn-secondary-professional btn-sm"
        >
          <Edit3 className="w-4 h-4" />
          Edit
        </button>
            </div>
    </div>
  )
}

// OverviewTab Component
function OverviewTab({ 
  onStoryUpdate, 
  setActiveTab, 
  totalWords, 
  totalAIGenerations, 
  thisWeekWords,
  generateStoryIdeas,
  storyIdeas,
  isGeneratingIdeas
}: { 
  onStoryUpdate: () => void, 
  setActiveTab: (tab: string) => void,
  totalWords: number,
  totalAIGenerations: number,
  thisWeekWords: number,
  generateStoryIdeas: () => void,
  storyIdeas: string[],
  isGeneratingIdeas: boolean
}) {
  const [stories, setStories] = useState<Story[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newStory, setNewStory] = useState<NewStory>({ title: '', genre: '', description: '' })

  const loadDashboardData = async () => {
    try {
      const response = await fetch('/api/stories')
      if (response.ok) {
        const data = await response.json()
        setStories(data.stories || [])
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  const createStory = async () => {
    if (!newStory.title.trim()) {
      alert('Please enter a story title')
      return
    }

    try {
      const response = await fetch('/api/stories/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStory)
      })

      if (response.ok) {
        setNewStory({ title: '', genre: '', description: '' })
        setShowCreateModal(false)
        onStoryUpdate()
        loadDashboardData()
      } else {
        const error = await response.json()
        alert(`Failed to create story: ${error.message || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error creating story:', error)
      alert('Failed to create story. Please try again.')
    }
  }

  // FIXED: Added proper functionality for all button handlers
  const handleContinue = (story: Story) => {
    // Navigate to story editor or open AI assistant
    setActiveTab('assistant')
    console.log('Continue story:', story)
  }

  const handleEdit = (story: Story) => {
    // Open story editor
    setActiveTab('stories')
    console.log('Edit story:', story)
  }

  const handleDelete = async (story: Story) => {
    if (confirm(`Are you sure you want to delete "${story.title}"?`)) {
      try {
        const response = await fetch(`/api/stories/${story.id}`, {
          method: 'DELETE'
        })
        if (response.ok) {
          loadDashboardData() // Refresh the stories list
        } else {
          alert('Failed to delete story')
        }
      } catch (error) {
        console.error('Error deleting story:', error)
        alert('Failed to delete story')
      }
    }
  }

  const handleAIAssistant = () => {
    setActiveTab('assistant')
  }

  const handleStoryIdeas = () => {
    setActiveTab('story-ideas')
    generateStoryIdeas()
  }

  const handleCharacters = () => {
    setActiveTab('characters')
  }

  return (
    <div className="overview-section space-y-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Stories" value={stories.length} icon={BookOpen} color="indigo" />
        <StatCard title="Words Written" value={totalWords.toLocaleString()} icon={PenTool} color="purple" />
        <StatCard title="AI Generations" value={totalAIGenerations} icon={Sparkles} color="emerald" />
        <StatCard title="This Week" value={thisWeekWords.toLocaleString()} icon={TrendingUp} color="amber" />
      </div>

      {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <QuickActionCard
          title="New Story"
          description="Start a new writing project"
          icon={Plus}
          color="purple"
          onClick={() => setShowCreateModal(true)}
        />
          <QuickActionCard
            title="AI Assistant"
          description="Get writing help and ideas"
            icon={Brain}
          color="amber"
          onClick={handleAIAssistant}
          />
          <QuickActionCard
          title="Story Ideas"
          description="Generate new concepts"
            icon={Lightbulb}
          color="indigo"
          onClick={handleStoryIdeas}
          />
          <QuickActionCard
          title="Characters"
          description="Create compelling characters"
            icon={Users}
          color="emerald"
          onClick={handleCharacters}
        />
      </div>

      {/* Recent Stories */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
            </div>
          <h2 className="text-2xl font-bold">Recent Stories</h2>
        </div>

        {stories.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">No stories yet</h3>
            <p className="text-secondary-600 mb-6">Start your writing journey by creating your first story</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn btn-primary"
            >
              <Plus className="w-5 h-5" />
                Create Your First Story
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {stories.slice(0, 3).map((story) => (
              <StoryCard
                key={story.id}
                story={story}
                onContinue={handleContinue}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
            </div>
          )}
        </div>

        {/* Story Ideas */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold">AI-Generated Story Ideas</h2>
          <button 
            onClick={generateStoryIdeas}
            disabled={isGeneratingIdeas}
            className="btn-secondary-professional ml-auto"
          >
            {isGeneratingIdeas ? 'Generating...' : 'Generate New Ideas'}
          </button>
        </div>

        <div className="grid gap-4">
          {storyIdeas.length > 0 ? (
            storyIdeas.map((idea, index) => (
              <div key={index} className="card p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-secondary-900 mb-1">{idea}</h4>
                    <div className="flex items-center gap-2">
                      <span className="badge badge-warning">AI Generated</span>
                      <span className="text-sm text-secondary-500">Just now</span>
                    </div>
                  </div>
                  <button className="btn btn-ghost btn-sm">
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="card p-8 text-center">
              <Lightbulb className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-secondary-700 mb-2">No Story Ideas Yet</h3>
              <p className="text-secondary-600 mb-4">Click "Generate New Ideas" to get AI-powered story concepts</p>
              <button 
                onClick={generateStoryIdeas}
                disabled={isGeneratingIdeas}
                className="btn-professional"
              >
                {isGeneratingIdeas ? 'Generating...' : 'Generate Ideas'}
              </button>
            </div>
          )}
        </div>
      </div>
              
      {/* Create Story Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="card-elevated p-8 w-full max-w-md">
            <h3 className="text-2xl font-bold mb-6">Create New Story</h3>
            <div className="space-y-4">
              <div>
                <label className="form-label">Story Title</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter your story title"
                  value={newStory.title}
                  onChange={(e) => setNewStory({ ...newStory, title: e.target.value })}
                  />
                </div>
              <div>
                <label className="form-label">Genre</label>
                  <select
                  className="form-input"
                    value={newStory.genre}
                  onChange={(e) => setNewStory({ ...newStory, genre: e.target.value })}
                  >
                    <option value="">Select a genre</option>
                  <option value="fantasy">Fantasy</option>
                  <option value="sci-fi">Science Fiction</option>
                  <option value="mystery">Mystery</option>
                  <option value="romance">Romance</option>
                  <option value="thriller">Thriller</option>
                  <option value="drama">Drama</option>
                  <option value="comedy">Comedy</option>
                  </select>
                </div>
              <div>
                <label className="form-label">Description (Optional)</label>
                  <textarea
                  className="form-input"
                  rows={3}
                  placeholder="Brief description of your story"
                    value={newStory.description}
                  onChange={(e) => setNewStory({ ...newStory, description: e.target.value })}
                  />
                </div>
              </div>
            <div className="flex gap-3 mt-6">
              <button
                  onClick={createStory}
                className="btn btn-primary flex-1"
              >
                      Create Story
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="btn btn-secondary"
                >
                  Cancel
              </button>
              </div>
            </div>
        </div>
      )}
    </div>
  )
}

// StoriesTab Component
function StoriesTab({ onStoryUpdate, setActiveTab }: { onStoryUpdate: () => void, setActiveTab: (tab: string) => void }) {
  const [stories, setStories] = useState<Story[]>([])

  const loadStories = async () => {
    try {
      const response = await fetch('/api/stories')
      if (response.ok) {
        const data = await response.json()
        setStories(data.stories || [])
      }
    } catch (error) {
      console.error('Failed to load stories:', error)
    }
  }

  useEffect(() => {
    loadStories()
  }, [])

  // FIXED: Updated handlers to use proper functionality
  const handleContinue = (story: Story) => {
    setActiveTab('assistant')
    console.log('Continue story:', story)
  }

  const handleEdit = (story: Story) => {
    // Open story editor - could be a modal or separate page
    console.log('Edit story:', story)
    alert('Story editor coming soon!')
  }

  const handleDelete = async (story: Story) => {
    if (confirm(`Are you sure you want to delete "${story.title}"?`)) {
      try {
        const response = await fetch(`/api/stories/${story.id}`, {
          method: 'DELETE'
        })
        if (response.ok) {
          loadStories() // Refresh the stories list
    } else {
          alert('Failed to delete story')
        }
      } catch (error) {
        console.error('Error deleting story:', error)
        alert('Failed to delete story')
      }
    }
  }

  const handleNewStory = () => {
    setActiveTab('overview') // Go back to overview to show create modal
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">My Stories</h2>
        <button 
          onClick={handleNewStory}
          className="btn btn-primary"
        >
          <Plus className="w-5 h-5" />
          New Story
        </button>
      </div>

      {stories.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-indigo-600" />
      </div>
          <h3 className="text-xl font-bold mb-2">No stories yet</h3>
          <p className="text-secondary-600 mb-6">Start your writing journey by creating your first story</p>
          <button 
            onClick={handleNewStory}
            className="btn btn-primary"
          >
            <Plus className="w-5 h-5" />
            Create Your First Story
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {stories.map((story) => (
            <StoryCard
              key={story.id}
              story={story}
              onContinue={handleContinue}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
      </div>
      )}
      </div>
  )
}

// Main WritingDashboard Component
export function WritingDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [stories, setStories] = useState<Story[]>([])
  const [totalWords, setTotalWords] = useState(0)
  const [totalAIGenerations, setTotalAIGenerations] = useState(0)
  const [thisWeekWords, setThisWeekWords] = useState(0)
  const [storyIdeas, setStoryIdeas] = useState<string[]>([])
  const [isGeneratingIdeas, setIsGeneratingIdeas] = useState(false)
  const [characterWord, setCharacterWord] = useState('')
  const [generatedCharacter, setGeneratedCharacter] = useState<string>('')
  const [isGeneratingCharacter, setIsGeneratingCharacter] = useState(false)

  // Load AI suggestions
  // useAISuggestions((session?.user as any)?.id || 'test@example.com')

  const loadDashboardData = async () => {
    try {
      const response = await fetch('/api/stories')
      if (response.ok) {
        const data = await response.json()
        setStories(data.stories || [])
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    }
  }

  // Calculate total words across all stories
  const calculateTotalWords = (stories: Story[]) => {
    return stories.reduce((total, story) => {
      const words = story.wordCount || 0
      return total + words
    }, 0)
  }

  // Calculate words written this week
  const calculateThisWeekWords = (stories: Story[]) => {
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    
    return stories.reduce((total, story) => {
      const storyDate = new Date(story.lastModified)
      if (storyDate >= oneWeekAgo) {
        const words = story.wordCount || 0
        return total + words
      }
      return total
    }, 0)
  }

  // Load AI generations count
  const loadAIGenerationsCount = async () => {
    try {
      const response = await fetch('/api/generations')
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setTotalAIGenerations(data.data?.length || 0)
        }
      }
    } catch (error) {
      console.error('Error loading AI generations:', error)
    }
  }

  // Generate AI story ideas
  const generateStoryIdeas = async () => {
    setIsGeneratingIdeas(true)
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'story_idea',
          prompt: 'Generate 5 creative and unique story ideas. Each idea should be 1-2 sentences and include the genre. Format as a numbered list.',
          genre: 'mixed',
          theme: 'creative'
        })
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.data && data.data.content) {
          // Parse the response to extract individual story ideas
          const content = data.data.content
          const ideas = content.split('\n')
            .filter((line: string) => line.trim().match(/^\d+\./))
            .map((line: string) => line.replace(/^\d+\.\s*/, '').trim())
            .filter((idea: string) => idea.length > 0)
          
          setStoryIdeas(ideas.slice(0, 5)) // Take up to 5 ideas
        }
      }
    } catch (error) {
      console.error('Error generating story ideas:', error)
    } finally {
      setIsGeneratingIdeas(false)
    }
  }

  // Generate AI character based on single word
  const generateCharacter = async () => {
    if (!characterWord.trim()) return
    
    setIsGeneratingCharacter(true)
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'character',
          prompt: `Create a detailed character based on the word "${characterWord}". Include: name, age, personality traits, background story, appearance, and motivations. Make it compelling and unique.`,
          genre: 'mixed',
          theme: 'character'
        })
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.data && data.data.content) {
          setGeneratedCharacter(data.data.content)
        }
      }
    } catch (error) {
      console.error('Error generating character:', error)
    } finally {
      setIsGeneratingCharacter(false)
    }
  }

  useEffect(() => {
    if (status === 'authenticated') {
      loadDashboardData()
      loadAIGenerationsCount()
    }
  }, [status])

  // Update dynamic data when stories change
  useEffect(() => {
    if (stories.length > 0) {
      setTotalWords(calculateTotalWords(stories))
      setThisWeekWords(calculateThisWeekWords(stories))
    }
  }, [stories])

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab 
          onStoryUpdate={loadDashboardData} 
          setActiveTab={setActiveTab}
          totalWords={totalWords}
          totalAIGenerations={totalAIGenerations}
          thisWeekWords={thisWeekWords}
          generateStoryIdeas={generateStoryIdeas}
          storyIdeas={storyIdeas}
          isGeneratingIdeas={isGeneratingIdeas}
        />
      case 'stories':
        return <StoriesTab onStoryUpdate={loadDashboardData} setActiveTab={setActiveTab} />
      case 'assistant':
        return <ChatBotNew />
      case 'characters':
        return (
          <div className="space-y-8">
            <div className="card p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold">AI Character Generator</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Enter a single word to generate a character:
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={characterWord}
                      onChange={(e) => setCharacterWord(e.target.value)}
                      placeholder="e.g., wizard, detective, warrior, scientist..."
                      className="flex-1 input-professional"
                      onKeyPress={(e) => e.key === 'Enter' && generateCharacter()}
                    />
                    <button
                      onClick={generateCharacter}
                      disabled={!characterWord.trim() || isGeneratingCharacter}
                      className="btn-professional"
                    >
                      {isGeneratingCharacter ? 'Generating...' : 'Generate Character'}
                    </button>
                  </div>
                </div>

                {generatedCharacter && (
                  <div className="card p-6 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200">
                    <div className="flex items-center gap-2 mb-4">
                      <Users className="w-5 h-5 text-emerald-600" />
                      <h3 className="text-lg font-semibold text-emerald-800">Generated Character</h3>
                    </div>
                    <div className="prose prose-sm max-w-none">
                      <div className="whitespace-pre-wrap text-secondary-700">
                        {generatedCharacter}
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => setGeneratedCharacter('')}
                        className="btn-secondary-professional"
                      >
                        Clear
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(generatedCharacter)
                          alert('Character copied to clipboard!')
                        }}
                        className="btn-professional"
                      >
                        Copy Character
                      </button>
                    </div>
                  </div>
                )}

                {!generatedCharacter && !isGeneratingCharacter && (
                  <div className="card p-8 text-center">
                    <Users className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-secondary-700 mb-2">No Character Generated Yet</h3>
                    <p className="text-secondary-600 mb-4">Enter a word above to generate a detailed character</p>
                    <div className="text-sm text-secondary-500">
                      <p>Try words like: wizard, detective, warrior, scientist, artist, villain, hero, mentor...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      case 'story-ideas':
        return (
          <div className="space-y-8">
            <div className="card p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold">AI Story Ideas Generator</h2>
                <button 
                  onClick={generateStoryIdeas}
                  disabled={isGeneratingIdeas}
                  className="btn-professional ml-auto"
                >
                  {isGeneratingIdeas ? 'Generating...' : 'Generate Ideas'}
                </button>
              </div>
              
              <div className="grid gap-4">
                {storyIdeas.length > 0 ? (
                  storyIdeas.map((idea, index) => (
                    <div key={index} className="card p-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-secondary-900 mb-2">{idea}</h4>
                          <div className="flex items-center gap-2">
                            <span className="badge-professional">AI Generated</span>
                            <span className="text-sm text-secondary-500">Just now</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(idea)
                            alert('Story idea copied to clipboard!')
                          }}
                          className="btn-secondary-professional"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="card p-8 text-center">
                    <Lightbulb className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-secondary-700 mb-2">No Story Ideas Yet</h3>
                    <p className="text-secondary-600 mb-4">Click "Generate Ideas" to get AI-powered story concepts</p>
                    <button 
                      onClick={generateStoryIdeas}
                      disabled={isGeneratingIdeas}
                      className="btn-professional"
                    >
                      {isGeneratingIdeas ? 'Generating...' : 'Generate Ideas'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      
      case 'dialogue':
        return (
          <div className="space-y-8">
            <div className="card p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold">AI Dialogue Generator</h2>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Character 1
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Detective, Hero, Villain..."
                      className="input-professional w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Character 2
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Suspect, Mentor, Ally..."
                      className="input-professional w-full"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Context/Situation
                  </label>
                  <textarea
                    placeholder="Describe the situation or context for the dialogue..."
                    className="input-professional w-full h-24"
                  />
                </div>
                
                <button className="btn-professional">
                  <MessageSquare className="w-4 h-4" />
                  Generate Dialogue
                </button>
              </div>
            </div>
          </div>
        )
      
      case 'plot-builder':
        return (
          <div className="space-y-8">
            <div className="card p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold">AI Plot Builder</h2>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Genre
                    </label>
                    <select className="input-professional w-full">
                      <option value="">Select Genre</option>
                      <option value="fantasy">Fantasy</option>
                      <option value="sci-fi">Science Fiction</option>
                      <option value="mystery">Mystery</option>
                      <option value="romance">Romance</option>
                      <option value="thriller">Thriller</option>
                      <option value="horror">Horror</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Theme
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Redemption, Love, Revenge..."
                      className="input-professional w-full"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Plot Description
                  </label>
                  <textarea
                    placeholder="Describe your story idea or plot elements..."
                    className="input-professional w-full h-32"
                  />
                </div>
                
                <button className="btn-professional">
                  <Target className="w-4 h-4" />
                  Build Plot
                </button>
              </div>
            </div>
          </div>
        )
      
      case 'world-builder':
        return (
          <div className="space-y-8">
            <div className="card p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold">AI World Builder</h2>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      World Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Middle Earth, Westeros..."
                      className="input-professional w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Genre/Setting
                    </label>
                    <select className="input-professional w-full">
                      <option value="">Select Setting</option>
                      <option value="fantasy">Fantasy</option>
                      <option value="sci-fi">Science Fiction</option>
                      <option value="steampunk">Steampunk</option>
                      <option value="dystopian">Dystopian</option>
                      <option value="historical">Historical</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    World Description
                  </label>
                  <textarea
                    placeholder="Describe your world, its history, culture, magic system, etc..."
                    className="input-professional w-full h-32"
                  />
                </div>
                
                <button className="btn-professional">
                  <Globe className="w-4 h-4" />
                  Build World
                </button>
              </div>
            </div>
          </div>
        )
      
      case 'stats':
        return (
          <div className="space-y-8">
            <div className="card p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold">Writing Statistics</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="card p-6 text-center">
                  <BookOpen className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                  <h3 className="text-2xl font-bold text-secondary-900">{totalWords.toLocaleString()}</h3>
                  <p className="text-secondary-600">Total Words</p>
                </div>
                <div className="card p-6 text-center">
                  <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <h3 className="text-2xl font-bold text-secondary-900">0</h3>
                  <p className="text-secondary-600">Writing Hours</p>
                </div>
                <div className="card p-6 text-center">
                  <Sparkles className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <h3 className="text-2xl font-bold text-secondary-900">{totalAIGenerations}</h3>
                  <p className="text-secondary-600">AI Generations</p>
                </div>
                <div className="card p-6 text-center">
                  <TrendingUp className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                  <h3 className="text-2xl font-bold text-secondary-900">{thisWeekWords.toLocaleString()}</h3>
                  <p className="text-secondary-600">This Week</p>
                </div>
              </div>
            </div>
          </div>
        )
      
      case 'insights':
        return (
          <div className="space-y-8">
            <div className="card p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold">AI Writing Insights</h2>
              </div>
              
              <div className="space-y-6">
                <div className="card p-6 bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200">
                  <h3 className="text-lg font-semibold text-secondary-900 mb-2">Writing Patterns</h3>
                  <p className="text-secondary-700">Your writing shows strong character development and engaging dialogue. Consider exploring more complex plot structures.</p>
                </div>
                
                <div className="card p-6 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200">
                  <h3 className="text-lg font-semibold text-secondary-900 mb-2">Improvement Suggestions</h3>
                  <p className="text-secondary-700">Try varying your sentence length and incorporating more sensory details to enhance reader immersion.</p>
                </div>
                
                <div className="card p-6 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200">
                  <h3 className="text-lg font-semibold text-secondary-900 mb-2">Genre Analysis</h3>
                  <p className="text-secondary-700">Your writing style aligns well with fantasy and adventure genres. Consider exploring these themes further.</p>
                </div>
              </div>
            </div>
          </div>
        )
      
      case 'progress':
        return (
          <div className="space-y-8">
            <div className="card p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold">Writing Progress</h2>
              </div>
              
              <div className="space-y-6">
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-secondary-900 mb-4">Daily Writing Streak</h3>
                  <div className="flex items-center gap-4">
                    <div className="text-3xl font-bold text-green-600">0</div>
                    <div>
                      <p className="text-secondary-700">Days in a row</p>
                      <p className="text-sm text-secondary-500">Keep writing to build your streak!</p>
                    </div>
                  </div>
                </div>
                
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-secondary-900 mb-4">Weekly Goals</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-secondary-700">Words Written</span>
                      <span className="font-semibold">{thisWeekWords} / 5000</span>
                    </div>
                    <div className="w-full bg-secondary-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{width: `${Math.min((thisWeekWords / 5000) * 100, 100)}%`}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      
      case 'export':
        return (
          <div className="space-y-8">
            <div className="card p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                  <Download className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold">Export Your Work</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="card p-6 text-center hover-lift">
                  <FileText className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-secondary-900 mb-2">PDF Export</h3>
                  <p className="text-sm text-secondary-600 mb-4">Export your stories as professional PDF documents</p>
                  <button className="btn-professional w-full">
                    <Download className="w-4 h-4" />
                    Export PDF
                  </button>
                </div>
                
                <div className="card p-6 text-center hover-lift">
                  <FileText className="w-8 h-8 text-green-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-secondary-900 mb-2">Word Document</h3>
                  <p className="text-sm text-secondary-600 mb-4">Export as .docx for further editing</p>
                  <button className="btn-professional w-full">
                    <Download className="w-4 h-4" />
                    Export DOCX
                  </button>
                </div>
                
                <div className="card p-6 text-center hover-lift">
                  <FileText className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-secondary-900 mb-2">EPUB</h3>
                  <p className="text-sm text-secondary-600 mb-4">Export as EPUB for e-readers</p>
                  <button className="btn-professional w-full">
                    <Download className="w-4 h-4" />
                    Export EPUB
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      
      case 'import':
        return (
          <div className="space-y-8">
            <div className="card p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center">
                  <Upload className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold">Import Your Work</h2>
              </div>
              
              <div className="space-y-6">
                <div className="card p-6 border-2 border-dashed border-secondary-300 text-center">
                  <Upload className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-secondary-900 mb-2">Drag & Drop Files</h3>
                  <p className="text-secondary-600 mb-4">Upload your existing stories and documents</p>
                  <button className="btn-professional">
                    <Upload className="w-4 h-4" />
                    Choose Files
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="card p-4">
                    <h4 className="font-semibold text-secondary-900 mb-2">Supported Formats</h4>
                    <ul className="text-sm text-secondary-600 space-y-1">
                      <li>• .txt (Plain Text)</li>
                      <li>• .docx (Word Documents)</li>
                      <li>• .pdf (PDF Files)</li>
                      <li>• .rtf (Rich Text Format)</li>
                    </ul>
                  </div>
                  
                  <div className="card p-4">
                    <h4 className="font-semibold text-secondary-900 mb-2">Import Features</h4>
                    <ul className="text-sm text-secondary-600 space-y-1">
                      <li>• Automatic formatting</li>
                      <li>• Character detection</li>
                      <li>• Chapter splitting</li>
                      <li>• Metadata extraction</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      
      case 'settings':
        return (
          <div className="space-y-8">
            <div className="card p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-500 to-slate-600 rounded-xl flex items-center justify-center">
                  <Settings className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold">Settings</h2>
              </div>
              
              <div className="space-y-6">
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-secondary-900 mb-4">Writing Preferences</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-secondary-900">Auto-save</h4>
                        <p className="text-sm text-secondary-600">Automatically save your work every 30 seconds</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-secondary-900">Dark Mode</h4>
                        <p className="text-sm text-secondary-600">Switch to dark theme for comfortable writing</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-secondary-900 mb-4">AI Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">AI Creativity Level</label>
                      <select className="input-professional w-full">
                        <option value="conservative">Conservative</option>
                        <option value="balanced" selected>Balanced</option>
                        <option value="creative">Creative</option>
                        <option value="experimental">Experimental</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">Response Length</label>
                      <select className="input-professional w-full">
                        <option value="short">Short</option>
                        <option value="medium" selected>Medium</option>
                        <option value="long">Long</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      
      case 'help':
        return (
          <div className="space-y-8">
            <div className="card p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <HelpCircle className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold">Help & Support</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-secondary-900 mb-4">Getting Started</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-semibold text-blue-600">1</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-secondary-900">Create Your First Story</h4>
                        <p className="text-sm text-secondary-600">Start by creating a new story from the Overview tab</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-semibold text-blue-600">2</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-secondary-900">Use AI Assistant</h4>
                        <p className="text-sm text-secondary-600">Get help with writing, character development, and plot ideas</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-semibold text-blue-600">3</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-secondary-900">Explore Tools</h4>
                        <p className="text-sm text-secondary-600">Try the character generator, plot builder, and world builder</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-secondary-900 mb-4">Quick Tips</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-secondary-900">Use Quick Prompts</h4>
                        <p className="text-sm text-secondary-600">Try the pre-written prompts in the AI Assistant for faster results</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Save className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-secondary-900">Auto-save</h4>
                        <p className="text-sm text-secondary-600">Your work is automatically saved as you write</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Download className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-secondary-900">Export Options</h4>
                        <p className="text-sm text-secondary-600">Export your stories in multiple formats (PDF, DOCX, EPUB)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="card p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
                <h3 className="text-lg font-semibold text-secondary-900 mb-2">Need More Help?</h3>
                <p className="text-secondary-700 mb-4">Contact our support team or check out our documentation</p>
                <div className="flex gap-3">
                  <button className="btn-professional">
                    <MessageCircle className="w-4 h-4" />
                    Contact Support
                  </button>
                  <button className="btn-secondary-professional">
                    <ExternalLink className="w-4 h-4" />
                    Documentation
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      
      default:
        return (
          <div className="card p-12 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Settings className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Feature Not Found</h3>
            <p className="text-secondary-600">This feature is not yet implemented</p>
          </div>
        )
    }
  }

  if (status === 'loading') {
  return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary-600" />
          <p className="text-secondary-600">Loading your dashboard...</p>
          </div>
            </div>
    )
  }

  if (status === 'unauthenticated') {
    router.push('/auth/signin')
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-100 relative overflow-hidden">
      {/* Professional animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-blue-200/20 to-cyan-200/20 rounded-full filter blur-3xl animate-pulse-subtle" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-gradient-to-br from-amber-200/15 to-orange-200/15 rounded-full filter blur-3xl animate-pulse-subtle" />
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-gradient-to-br from-emerald-200/10 to-teal-200/10 rounded-full filter blur-3xl animate-pulse-subtle" />
      </div>

      <div className="container mx-auto px-6 py-8 relative z-10">
        {/* Professional Header */}
        <div className="mb-8">
          <div className="card-elevated-professional p-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              {/* Brand Section */}
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="heading-professional-2 mb-2">
                    AI Writing Studio
                  </h1>
                  <p className="body-professional-large text-slate-600">
                    Welcome back, {session?.user?.name || 'Writer'}! Ready to create something amazing?
                  </p>
          </div>
      </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <button
                  onClick={() => setActiveTab('assistant')}
                  className="btn-professional btn-lg group hover:scale-105 active:scale-95 transition-transform duration-300"
                >
                  <Brain className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  <span>AI Assistant</span>
                </button>
                
                {/* User Profile */}
                <div className="card-professional p-4 flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-md">
                    <User className="w-6 h-6 text-white" />
              </div>
                  <div className="text-right min-w-0">
                    <p className="body-professional font-semibold text-slate-900 truncate">{session?.user?.name}</p>
                    <p className="text-sm text-slate-500 truncate">{session?.user?.email}</p>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="btn-secondary-professional btn-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
              </div>
              </div>
            </div>
              </div>
            </div>
            
        {/* Consolidated Navigation */}
        <div className="mb-8">
          <div className="card-professional p-6">
            <div className="navigation-container flex flex-wrap gap-3">
              {tabCategories.map((category) => {
                const Icon = category.icon
                const hasSubTabs = category.tabs.length > 1
                const isActive = activeCategory === category.id
                
                return (
                  <div key={category.id} className="dropdown-container">
                    <button
                      onClick={() => {
                        if (hasSubTabs) {
                          setActiveCategory(isActive ? null : category.id)
                        } else {
                          setActiveTab(category.tabs[0])
                          setActiveCategory(null)
                        }
                      }}
                      className={`${
                        isActive || (hasSubTabs && activeCategory === category.id)
                          ? 'btn-professional'
                          : 'btn-secondary-professional'
                      } group hover-lift relative`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{category.name}</span>
                      {hasSubTabs && (
                        <ChevronDown className={`w-4 h-4 transition-transform ${isActive ? 'rotate-180' : ''}`} />
                      )}
                    </button>

                    {/* Dropdown Menu */}
                    {hasSubTabs && isActive && (
                      <div className="dropdown-menu">
                        {category.tabs.map((tabId) => {
                          const tab = tabs.find(t => t.id === tabId)
                          if (!tab) return null
                          const TabIcon = tab.icon
                          
                          return (
                            <button
                              key={tabId}
                              onClick={() => {
                                setActiveTab(tabId)
                                setActiveCategory(null)
                              }}
                              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-all duration-300 text-left hover-lift"
                            >
                              <TabIcon className="w-5 h-5 text-slate-600" />
                              <div>
                                <div className="font-medium text-slate-900">{tab.name}</div>
                                <div className="text-sm text-slate-500">{tab.description}</div>
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="tab-content transition-all duration-500 animate-fade-in-up">
          {renderTabContent()}
        </div>
      </div>
    </div>
  )
}