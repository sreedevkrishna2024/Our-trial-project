'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Lightbulb, 
  Sparkles, 
  Save, 
  Copy, 
  RefreshCw,
  Star,
  BookOpen,
  Heart,
  Zap,
  Users,
  ArrowRight,
  Filter,
  Shuffle,
  Download,
  Share,
  Edit3,
  Trash2
} from 'lucide-react'

interface StoryIdea {
  id: string
  title: string
  concept: string
  genre: string
  themes: string[]
  characters: string[]
  conflict: string
  setting: string
  potential: 'high' | 'medium' | 'low'
  createdAt: Date
}

const GENRES = [
  'Science Fiction', 'Fantasy', 'Mystery', 'Romance', 'Thriller', 'Horror',
  'Literary Fiction', 'Young Adult', 'Historical Fiction', 'Dystopian', 'Adventure'
]

const THEMES = [
  'Identity', 'Love', 'Power', 'Sacrifice', 'Redemption', 'Coming of Age',
  'Family', 'Friendship', 'Justice', 'Freedom', 'Technology', 'Nature',
  'Time', 'Memory', 'Dreams', 'Survival', 'Betrayal', 'Discovery'
]

export function StoryIdeaGeneratorNew() {
  const [selectedGenre, setSelectedGenre] = useState<string>('')
  const [selectedThemes, setSelectedThemes] = useState<string[]>([])
  const [generatedIdeas, setGeneratedIdeas] = useState<StoryIdea[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [savedIdeas, setSavedIdeas] = useState<StoryIdea[]>([])
  const [activeTab, setActiveTab] = useState<'generate' | 'saved'>('generate')

  // Load saved ideas from backend and localStorage
  useEffect(() => {
    const loadSavedIdeas = async () => {
      try {
        // Try to load from backend first
        const response = await fetch('/api/content/story-ideas')
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.data) {
            // Convert backend data to component format
            const ideas = data.data.map((item: any) => ({
              id: item.id,
              title: item.title,
              concept: item.concept,
              genre: item.genre,
              themes: item.themes ? JSON.parse(item.themes) : [],
              characters: item.characters ? JSON.parse(item.characters) : [],
              conflict: item.conflict,
              setting: item.setting,
              potential: item.potential,
              createdAt: new Date(item.createdAt)
            }))
            setSavedIdeas(ideas)
            return
          }
        }
      } catch (error) {
        console.error('Error loading saved ideas from backend:', error)
      }

      // Fallback to localStorage
      const saved = localStorage.getItem('saved-story-ideas')
      if (saved) {
        try {
          setSavedIdeas(JSON.parse(saved))
        } catch (error) {
          console.error('Error loading saved ideas from localStorage:', error)
        }
      }
    }

    loadSavedIdeas()
  }, [])

  // Save ideas to localStorage
  useEffect(() => {
    localStorage.setItem('saved-story-ideas', JSON.stringify(savedIdeas))
  }, [savedIdeas])

  const generateIdeas = async () => {
    setIsGenerating(true)
    
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'story_idea',
          genre: selectedGenre || 'fantasy',
          theme: selectedThemes.length > 0 ? selectedThemes[0] : 'adventure'
        })
      })

      const data = await response.json()
      
      if (data.success && data.data.content) {
        const aiIdea = data.data.content
        const newIdea: StoryIdea = {
          id: Date.now().toString(),
          title: aiIdea.title || 'Untitled Story',
          concept: aiIdea.logline || aiIdea.concept || 'A compelling story concept',
          genre: aiIdea.genre || selectedGenre || 'Fantasy',
          themes: Array.isArray(aiIdea.themes) ? aiIdea.themes : [aiIdea.theme || selectedThemes[0] || 'Adventure'],
          characters: Array.isArray(aiIdea.characters) ? aiIdea.characters : ['Character 1', 'Character 2'],
          conflict: aiIdea.conflict || 'An intriguing conflict',
          setting: aiIdea.setting || 'An interesting setting',
          potential: 'high',
          createdAt: new Date()
        }
        setGeneratedIdeas(prev => [newIdea, ...prev])
      } else {
        throw new Error('Invalid response format')
      }
    } catch (error) {
      console.error('Error generating ideas:', error)
      // Fallback idea
      const fallbackIdea: StoryIdea = {
        id: Date.now().toString(),
        title: 'The Mysterious Journey',
        concept: 'A hero embarks on an unexpected adventure that changes their life forever.',
        genre: selectedGenre || 'Fantasy',
        themes: selectedThemes.length > 0 ? selectedThemes : ['Adventure'],
        characters: ['The Hero', 'The Mentor', 'The Antagonist'],
        conflict: 'The hero must overcome their greatest fear to save what they love.',
        setting: 'A world where magic and mystery intertwine',
        potential: 'high',
        createdAt: new Date()
      }
      setGeneratedIdeas(prev => [fallbackIdea, ...prev])
    } finally {
      setIsGenerating(false)
    }
  }

  const saveIdea = async (idea: StoryIdea) => {
    try {
      const response = await fetch('/api/content/story-ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: idea.title,
          concept: idea.concept,
          genre: idea.genre,
          themes: idea.themes,
          characters: idea.characters,
          conflict: idea.conflict,
          setting: idea.setting,
          potential: idea.potential
        })
      })

      const data = await response.json()
      
      if (data.success) {
        // Add to local state with the server ID
        const savedIdea = { ...idea, id: data.storyIdea.id }
        setSavedIdeas(prev => [savedIdea, ...prev])
        // Also save to localStorage as backup
        localStorage.setItem('saved-story-ideas', JSON.stringify([savedIdea, ...savedIdeas]))
      } else {
        console.error('Failed to save idea:', data.error)
        // Fallback to localStorage only
        const savedIdea = { ...idea, id: `saved-${Date.now()}` }
        setSavedIdeas(prev => [savedIdea, ...prev])
      }
    } catch (error) {
      console.error('Error saving idea:', error)
      // Fallback to localStorage only
      const savedIdea = { ...idea, id: `saved-${Date.now()}` }
      setSavedIdeas(prev => [savedIdea, ...prev])
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const deleteSavedIdea = (id: string) => {
    setSavedIdeas(prev => prev.filter(idea => idea.id !== id))
  }

  const exportIdeas = () => {
    const dataStr = JSON.stringify(savedIdeas, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'story-ideas.json'
    link.click()
  }

  const toggleTheme = (theme: string) => {
    setSelectedThemes(prev => 
      prev.includes(theme) 
        ? prev.filter(t => t !== theme)
        : [...prev, theme]
    )
  }

  const developIdea = (idea: StoryIdea) => {
    const developPrompt = `Develop this story idea further: "${idea.title}" - ${idea.concept}. Create a detailed plot outline, character development, and scene structure.`
    localStorage.setItem('ai_assistant_prompt', developPrompt)
    localStorage.setItem('ai_assistant_template', 'plot')
    window.dispatchEvent(new CustomEvent('navigateToAssistant'))
  }

  const generateRandomIdea = () => {
    const randomGenre = GENRES[Math.floor(Math.random() * GENRES.length)]
    const randomThemes = THEMES.sort(() => 0.5 - Math.random()).slice(0, 2)
    setSelectedGenre(randomGenre)
    setSelectedThemes(randomThemes)
    generateIdeas()
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
            <Lightbulb className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gradient">Story Idea Generator</h1>
            <p className="text-neutral-600 mt-2">AI-powered creative inspiration for your next masterpiece</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-8">
        <div className="bg-neutral-100 p-1 rounded-2xl">
          <button
            onClick={() => setActiveTab('generate')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
              activeTab === 'generate'
                ? 'bg-white text-indigo-600 shadow-md'
                : 'text-neutral-600 hover:text-neutral-800'
            }`}
          >
            Generate Ideas
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
              activeTab === 'saved'
                ? 'bg-white text-indigo-600 shadow-md'
                : 'text-neutral-600 hover:text-neutral-800'
            }`}
          >
            Saved Ideas ({savedIdeas.length})
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'generate' ? (
          <motion.div
            key="generate"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            {/* Generation Controls */}
            <div className="card">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Genre Selection */}
                <div>
                  <h3 className="text-lg font-semibold text-neutral-800 mb-4 flex items-center gap-2">
                    <Filter className="w-5 h-5 text-indigo-600" />
                    Choose Genre
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {GENRES.map((genre) => (
                      <button
                        key={genre}
                        onClick={() => setSelectedGenre(genre === selectedGenre ? '' : genre)}
                        className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                          selectedGenre === genre
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                            : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                        }`}
                      >
                        {genre}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Theme Selection */}
                <div>
                  <h3 className="text-lg font-semibold text-neutral-800 mb-4 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-indigo-600" />
                    Select Themes
                  </h3>
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto custom-scrollbar">
                    {THEMES.map((theme) => (
                      <button
                        key={theme}
                        onClick={() => toggleTheme(theme)}
                        className={`p-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          selectedThemes.includes(theme)
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                            : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                        }`}
                      >
                        {theme}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 mt-8 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 8px 25px rgba(79, 70, 229, 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={generateIdeas}
                  disabled={isGenerating}
                  className="btn-primary flex items-center gap-3 px-8 py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate Ideas
                    </>
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={generateRandomIdea}
                  disabled={isGenerating}
                  className="btn-secondary flex items-center gap-3 px-6 py-4 text-lg disabled:opacity-50"
                >
                  <Shuffle className="w-5 h-5" />
                  Random Idea
                </motion.button>
              </div>
            </div>

            {/* Generated Ideas */}
            {generatedIdeas.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-neutral-800 flex items-center gap-2">
                  <Star className="w-6 h-6 text-yellow-500" />
                  Generated Ideas ({generatedIdeas.length})
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {generatedIdeas.map((idea) => (
                    <IdeaCard
                      key={idea.id}
                      idea={idea}
                      onSave={() => saveIdea(idea)}
                      onCopy={() => copyToClipboard(`${idea.title}\n\n${idea.concept}`)}
                      onDevelop={() => developIdea(idea)}
                      isSaved={savedIdeas.some(saved => saved.title === idea.title)}
                    />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="saved"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {savedIdeas.length > 0 ? (
              <>
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold text-neutral-800 flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-green-500" />
                    Saved Ideas ({savedIdeas.length})
                  </h3>
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={exportIdeas}
                      className="btn-secondary flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Export
                    </motion.button>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {savedIdeas.map((idea) => (
                    <IdeaCard
                      key={idea.id}
                      idea={idea}
                      onSave={() => {}}
                      onCopy={() => copyToClipboard(`${idea.title}\n\n${idea.concept}`)}
                      onDevelop={() => developIdea(idea)}
                      isSaved={true}
                      onDelete={() => deleteSavedIdea(idea.id)}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-16">
                <BookOpen className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-neutral-600 mb-2">No saved ideas yet</h3>
                <p className="text-neutral-500">Generate some ideas and save your favorites!</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function IdeaCard({ 
  idea, 
  onSave, 
  onCopy, 
  onDevelop, 
  isSaved, 
  onDelete 
}: { 
  idea: StoryIdea
  onSave: () => void
  onCopy: () => void
  onDevelop: () => void
  isSaved: boolean
  onDelete?: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card hover-lift"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h4 className="text-lg font-bold text-neutral-800 mb-2">{idea.title}</h4>
          <div className="flex items-center gap-2 mb-3">
            <span className="badge badge-primary">{idea.genre}</span>
            <span className={`badge ${
              idea.potential === 'high' ? 'badge-success' : 
              idea.potential === 'medium' ? 'badge-secondary' : 'badge-primary'
            }`}>
              {idea.potential} potential
            </span>
          </div>
        </div>
        <div className="flex gap-1">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onCopy}
            className="p-2 text-neutral-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            title="Copy"
          >
            <Copy className="w-4 h-4" />
          </motion.button>
          {!isSaved && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onSave}
              className="p-2 text-neutral-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title="Save"
            >
              <Save className="w-4 h-4" />
            </motion.button>
          )}
          {onDelete && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onDelete}
              className="p-2 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      </div>

      <p className="text-neutral-600 mb-4 leading-relaxed">{idea.concept}</p>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-neutral-600">
          <Users className="w-4 h-4" />
          <span className="font-medium">Characters:</span>
          <span>{idea.characters.join(', ')}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-neutral-600">
          <Zap className="w-4 h-4" />
          <span className="font-medium">Conflict:</span>
          <span>{idea.conflict}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-neutral-600">
          <Heart className="w-4 h-4" />
          <span className="font-medium">Themes:</span>
          <span>{idea.themes.join(', ')}</span>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onDevelop}
        className="w-full btn-primary flex items-center justify-center gap-2"
      >
        <Sparkles className="w-4 h-4" />
        Develop this idea
        <ArrowRight className="w-4 h-4" />
      </motion.button>
    </motion.div>
  )
}

