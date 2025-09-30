'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Target, 
  Sparkles, 
  Save, 
  Copy, 
  RefreshCw,
  BookOpen,
  Download,
  Share,
  Edit3,
  Trash2,
  ArrowRight,
  Filter,
  Shuffle,
  Clock,
  TrendingUp,
  CheckCircle,
  Circle,
  ArrowDown
} from 'lucide-react'

interface PlotStructure {
  id: string
  name: string
  description: string
  plotPoints: string[]
  genre: string
  theme: string
  structure: string
  createdAt: Date
}

const PLOT_STRUCTURES = [
  { 
    id: 'three-act', 
    name: 'Three-Act Structure', 
    description: 'Classic beginning, middle, end structure',
    points: ['Setup', 'Confrontation', 'Resolution']
  },
  { 
    id: 'hero-journey', 
    name: 'Hero\'s Journey', 
    description: 'Mythological adventure structure',
    points: ['Call to Adventure', 'Crossing the Threshold', 'Return with Elixir']
  },
  { 
    id: 'fichtean', 
    name: 'Fichtean Curve', 
    description: 'Rising action with multiple crises',
    points: ['Inciting Incident', 'Rising Action', 'Climax', 'Falling Action']
  },
  { 
    id: 'seven-point', 
    name: 'Seven-Point Story Structure', 
    description: 'Detailed plot development framework',
    points: ['Hook', 'Plot Turn 1', 'Pinch Point 1', 'Midpoint', 'Pinch Point 2', 'Plot Turn 2', 'Resolution']
  }
]

const GENRES = [
  'Fantasy', 'Science Fiction', 'Mystery', 'Romance', 'Thriller', 'Horror',
  'Literary Fiction', 'Young Adult', 'Historical Fiction', 'Dystopian', 'Adventure'
]

const THEMES = [
  'Identity', 'Love', 'Power', 'Sacrifice', 'Redemption', 'Coming of Age',
  'Family', 'Friendship', 'Justice', 'Freedom', 'Technology', 'Nature',
  'Time', 'Memory', 'Dreams', 'Survival', 'Betrayal', 'Discovery'
]

export function PlotBuilderNew() {
  const [selectedGenre, setSelectedGenre] = useState<string>('')
  const [selectedTheme, setSelectedTheme] = useState<string>('')
  const [selectedStructure, setSelectedStructure] = useState<string>('')
  const [generatedPlot, setGeneratedPlot] = useState<PlotStructure | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [savedPlots, setSavedPlots] = useState<PlotStructure[]>([])

  // Load saved plots from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('saved-plots')
    if (saved) {
      try {
        setSavedPlots(JSON.parse(saved))
      } catch (error) {
        console.error('Error loading saved plots:', error)
      }
    }
  }, [])

  // Save plots to localStorage
  useEffect(() => {
    localStorage.setItem('saved-plots', JSON.stringify(savedPlots))
  }, [savedPlots])

  const generatePlot = async () => {
    setIsGenerating(true)
    setGeneratedPlot(null)

    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'plot',
          genre: selectedGenre || 'fantasy',
          theme: selectedTheme || 'adventure',
          structure: selectedStructure || 'Hero\'s Journey'
        })
      })

      const data = await response.json()

      if (data.success && data.data.content) {
        const plotPoints = Array.isArray(data.data.content) ? data.data.content : data.data.content.split('\n').filter((line: string) => line.trim())
        
        const newPlot: PlotStructure = {
          id: Date.now().toString(),
          name: `${selectedGenre || 'Generic'} Plot Outline`,
          description: `AI-generated plot for a ${selectedGenre || 'fantasy'} story with ${selectedTheme || 'adventure'} theme using ${selectedStructure || 'Hero\'s Journey'} structure.`,
          plotPoints: plotPoints,
          genre: selectedGenre,
          theme: selectedTheme,
          structure: selectedStructure,
          createdAt: new Date()
        }
        setGeneratedPlot(newPlot)
      } else {
        throw new Error('Invalid response format or no content')
      }
    } catch (error) {
      console.error('Error generating plot:', error)
      // Fallback plot
      setGeneratedPlot({
        id: Date.now().toString(),
        name: 'Fallback Plot Outline',
        description: 'A generic plot outline due to AI generation failure.',
        plotPoints: [
          'Inciting Incident: The hero receives a call to adventure.',
          'Rising Action: The hero faces challenges and gathers allies.',
          'Climax: The hero confronts the main antagonist and overcomes a major obstacle.',
          'Falling Action: The consequences of the climax unfold.',
          'Resolution: The story concludes, and the hero returns changed.'
        ],
        genre: selectedGenre,
        theme: selectedTheme,
        structure: selectedStructure,
        createdAt: new Date()
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const savePlot = async () => {
    if (generatedPlot) {
      try {
        const response = await fetch('/api/content/plots', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: generatedPlot.name,
            description: generatedPlot.description,
            plotPoints: generatedPlot.plotPoints,
            genre: generatedPlot.genre,
            theme: generatedPlot.theme,
            structure: generatedPlot.structure
          })
        })

        const data = await response.json()
        
        if (data.success) {
          const savedPlot = { ...generatedPlot, id: data.plot.id }
          setSavedPlots(prev => [savedPlot, ...prev])
          localStorage.setItem('saved-plots', JSON.stringify([savedPlot, ...savedPlots]))
        } else {
          console.error('Failed to save plot:', data.error)
          const savedPlot = { ...generatedPlot, id: `saved-${Date.now()}` }
          setSavedPlots(prev => [savedPlot, ...prev])
        }
      } catch (error) {
        console.error('Error saving plot:', error)
        const savedPlot = { ...generatedPlot, id: `saved-${Date.now()}` }
        setSavedPlots(prev => [savedPlot, ...prev])
      }
    }
  }

  const copyPlot = async () => {
    if (generatedPlot) {
      const plotText = `${generatedPlot.name}\n\n${generatedPlot.description}\n\nPlot Points:\n${generatedPlot.plotPoints.map((point, index) => `${index + 1}. ${point}`).join('\n')}`
      
      try {
        await navigator.clipboard.writeText(plotText)
      } catch (error) {
        console.error('Failed to copy:', error)
      }
    }
  }

  const deletePlot = (id: string) => {
    setSavedPlots(prev => prev.filter(plot => plot.id !== id))
  }

  const exportPlots = () => {
    const dataStr = JSON.stringify(savedPlots, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'plots.json'
    link.click()
  }

  const generateRandomPlot = () => {
    const randomGenre = GENRES[Math.floor(Math.random() * GENRES.length)]
    const randomTheme = THEMES[Math.floor(Math.random() * THEMES.length)]
    const randomStructure = PLOT_STRUCTURES[Math.floor(Math.random() * PLOT_STRUCTURES.length)]
    
    setSelectedGenre(randomGenre)
    setSelectedTheme(randomTheme)
    setSelectedStructure(randomStructure.id)
    generatePlot()
  }

  const usePlotInStory = (plot: PlotStructure) => {
    const storyPrompt = `Create a story using this plot structure: "${plot.name}" - ${plot.description}. Plot points: ${plot.plotPoints.join(', ')}.`
    localStorage.setItem('ai_assistant_prompt', storyPrompt)
    localStorage.setItem('ai_assistant_template', 'plot')
    window.dispatchEvent(new CustomEvent('navigateToAssistant'))
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
            <Target className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gradient">Plot Builder</h1>
            <p className="text-neutral-600 mt-2">Structure compelling narratives with AI-powered plot development</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Generation Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Plot Generation */}
          <div className="card">
            <h3 className="text-xl font-bold text-neutral-800 mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              Generate Plot
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Genre Selection */}
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-3">
                  Genre
                </label>
                <select
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  className="input w-full"
                >
                  <option value="">Select genre</option>
                  {GENRES.map(genre => (
                    <option key={genre} value={genre}>{genre}</option>
                  ))}
                </select>
              </div>

              {/* Theme Selection */}
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-3">
                  Theme
                </label>
                <input
                  type="text"
                  value={selectedTheme}
                  onChange={(e) => setSelectedTheme(e.target.value)}
                  className="input w-full"
                  placeholder="e.g., Redemption, Identity"
                />
              </div>

              {/* Structure Selection */}
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-3">
                  Structure
                </label>
                <select
                  value={selectedStructure}
                  onChange={(e) => setSelectedStructure(e.target.value)}
                  className="input w-full"
                >
                  <option value="">Select structure</option>
                  {PLOT_STRUCTURES.map(structure => (
                    <option key={structure.id} value={structure.id}>{structure.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Structure Preview */}
            {selectedStructure && (
              <div className="mt-6 p-4 bg-neutral-50 rounded-lg">
                <h4 className="font-semibold text-neutral-700 mb-3">
                  {PLOT_STRUCTURES.find(s => s.id === selectedStructure)?.name}
                </h4>
                <p className="text-sm text-neutral-600 mb-3">
                  {PLOT_STRUCTURES.find(s => s.id === selectedStructure)?.description}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {PLOT_STRUCTURES.find(s => s.id === selectedStructure)?.points.map((point, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <Circle className="w-3 h-3 text-indigo-600" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 mt-6">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 8px 25px rgba(79, 70, 229, 0.3)" }}
                whileTap={{ scale: 0.95 }}
                onClick={generatePlot}
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
                    Generate Plot
                  </>
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={generateRandomPlot}
                disabled={isGenerating}
                className="btn-secondary flex items-center gap-3 px-6 py-4 text-lg disabled:opacity-50"
              >
                <Shuffle className="w-5 h-5" />
                Random
              </motion.button>
            </div>
          </div>

          {/* Generated Plot Display */}
          {generatedPlot && (
            <PlotCard
              plot={generatedPlot}
              onSave={savePlot}
              onCopy={copyPlot}
              onUseInStory={() => usePlotInStory(generatedPlot)}
              isSaved={savedPlots.some(saved => saved.name === generatedPlot.name)}
            />
          )}
        </div>

        {/* Saved Plots Sidebar */}
        <div className="space-y-6">
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-neutral-800 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-green-500" />
                Saved Plots ({savedPlots.length})
              </h3>
              {savedPlots.length > 0 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={exportPlots}
                  className="btn-secondary flex items-center gap-2 text-sm"
                >
                  <Download className="w-4 h-4" />
                  Export
                </motion.button>
              )}
            </div>

            {savedPlots.length > 0 ? (
              <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
                {savedPlots.map((plot) => (
                  <SavedPlotCard
                    key={plot.id}
                    plot={plot}
                    onDelete={() => deletePlot(plot.id)}
                    onUseInStory={() => usePlotInStory(plot)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Target className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                <p className="text-neutral-500 text-sm">No saved plots yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function PlotCard({ 
  plot, 
  onSave, 
  onCopy, 
  onUseInStory, 
  isSaved 
}: { 
  plot: PlotStructure
  onSave: () => void
  onCopy: () => void
  onUseInStory: () => void
  isSaved: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card animate-fade-in-up"
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <h4 className="text-2xl font-bold text-neutral-800 mb-2">{plot.name}</h4>
          <div className="flex items-center gap-3">
            <span className="badge badge-primary">{plot.genre}</span>
            <span className="badge badge-secondary">{plot.structure}</span>
            <span className="badge badge-success">{plot.theme}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onCopy}
            className="p-2 text-neutral-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            title="Copy plot"
          >
            <Copy className="w-4 h-4" />
          </motion.button>
          {!isSaved && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onSave}
              className="p-2 text-neutral-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title="Save plot"
            >
              <Save className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      </div>

      <p className="text-neutral-600 mb-6 leading-relaxed">{plot.description}</p>

      <div className="space-y-4">
        <h5 className="font-semibold text-neutral-700 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Plot Structure
        </h5>
        <div className="space-y-3">
          {plot.plotPoints.map((point, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-neutral-50 rounded-lg">
              <div className="flex-shrink-0 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                {index + 1}
              </div>
              <p className="text-neutral-700 leading-relaxed">{point}</p>
            </div>
          ))}
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onUseInStory}
        className="w-full btn-primary flex items-center justify-center gap-2 mt-6"
      >
        <BookOpen className="w-4 h-4" />
        Use in Story
        <ArrowRight className="w-4 h-4" />
      </motion.button>
    </motion.div>
  )
}

function SavedPlotCard({ 
  plot, 
  onDelete, 
  onUseInStory 
}: { 
  plot: PlotStructure
  onDelete: () => void
  onUseInStory: () => void
}) {
  return (
    <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200 hover:border-neutral-300 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <h5 className="font-semibold text-neutral-800">{plot.name}</h5>
          <div className="flex gap-1 mt-1">
            <span className="badge badge-primary text-xs">{plot.genre}</span>
            <span className="badge badge-secondary text-xs">{plot.structure}</span>
          </div>
        </div>
        <button
          onClick={onDelete}
          className="p-1 text-neutral-400 hover:text-red-600 transition-colors"
          title="Delete plot"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
      <p className="text-xs text-neutral-500 mb-3 line-clamp-2">{plot.description}</p>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onUseInStory}
        className="w-full btn-secondary text-xs py-2 flex items-center justify-center gap-1"
      >
        <BookOpen className="w-3 h-3" />
        Use in Story
      </motion.button>
    </div>
  )
}

