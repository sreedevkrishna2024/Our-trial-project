'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AIGenerationDisplay } from './RichTextDisplay'
import { 
  Send, 
  Copy, 
  Save, 
  Download, 
  RefreshCw, 
  X, 
  Settings,
  FileText,
  BookOpen,
  MessageSquare,
  Lightbulb,
  Zap,
  Trash2,
  History,
  Play,
  Square,
  FileDown,
  Share,
  Sparkles,
  Brain,
  PenTool,
  Target,
  Users,
  Clock,
  TrendingUp,
  Award
} from 'lucide-react'
import { exportAsTxt, exportAsHtml, exportAsMarkdown, exportAsPdf, copyToClipboard } from '@/lib/exportUtils'

interface Generation {
  id: string
  content: string
  timestamp: Date
  template: string
  settings: GenerationSettings
}

interface GenerationSettings {
  tone: string
  temperature: number
  length: string
}

const TONES = [
  { value: 'Professional', label: 'Professional', color: 'from-blue-500 to-blue-600' },
  { value: 'Creative', label: 'Creative', color: 'from-purple-500 to-purple-600' },
  { value: 'Casual', label: 'Casual', color: 'from-green-500 to-green-600' },
  { value: 'Formal', label: 'Formal', color: 'from-gray-500 to-gray-600' },
  { value: 'Conversational', label: 'Conversational', color: 'from-orange-500 to-orange-600' },
  { value: 'Poetic', label: 'Poetic', color: 'from-pink-500 to-pink-600' }
]

const LENGTHS = [
  { value: 'Short', label: 'Short (50-100 words)', icon: '📝' },
  { value: 'Medium', label: 'Medium (100-300 words)', icon: '📄' },
  { value: 'Long', label: 'Long (300-500 words)', icon: '📃' },
  { value: 'Very Long', label: 'Very Long (500+ words)', icon: '📊' }
]

const TEMPLATES = [
  {
    id: 'idea',
    name: 'Story Idea',
    icon: Lightbulb,
    prompt: 'Generate a creative story idea with a compelling concept, interesting characters, and an engaging conflict.',
    color: 'from-amber-500 to-yellow-500',
    description: 'Generate unique story concepts with characters and conflicts'
  },
  {
    id: 'plot',
    name: 'Plot Outline',
    icon: BookOpen,
    prompt: 'Create a detailed plot outline with a clear beginning, middle, and end. Include key plot points and character development.',
    color: 'from-emerald-500 to-teal-500',
    description: 'Structure your story with detailed plot points'
  },
  {
    id: 'dialogue',
    name: 'Dialogue',
    icon: MessageSquare,
    prompt: 'Write natural, engaging dialogue between characters that reveals personality and advances the story.',
    color: 'from-blue-500 to-indigo-500',
    description: 'Create authentic character conversations'
  }
]

export function WriterAssistant() {
  const [prompt, setPrompt] = useState('')
  const [output, setOutput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState('idea')
  const [settings, setSettings] = useState<GenerationSettings>({
    tone: 'Creative',
    temperature: 0.7,
    length: 'Medium'
  })
  const [history, setHistory] = useState<Generation[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [abortController, setAbortController] = useState<AbortController | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [showExportMenu, setShowExportMenu] = useState(false)

  const outputRef = useRef<HTMLDivElement>(null)

  // Load history from localStorage on mount and set up navigation listener
  useEffect(() => {
    const savedHistory = localStorage.getItem('writer-history')
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory)
        setHistory(parsed.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        })))
      } catch (error) {
        console.error('Failed to load history:', error)
      }
    }

    // Listen for navigation events from other components
    const handleNavigateToAssistant = () => {
      const prompt = localStorage.getItem('ai_assistant_prompt')
      const template = localStorage.getItem('ai_assistant_template')
      
      if (prompt) {
        setPrompt(prompt)
        localStorage.removeItem('ai_assistant_prompt')
      }
      
      if (template) {
        setSelectedTemplate(template)
        localStorage.removeItem('ai_assistant_template')
      }
    }

    window.addEventListener('navigateToAssistant', handleNavigateToAssistant)
    return () => window.removeEventListener('navigateToAssistant', handleNavigateToAssistant)
  }, [])

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('writer-history', JSON.stringify(history))
  }, [history])

  const generateContent = useCallback(async (customPrompt?: string) => {
    const finalPrompt = customPrompt || prompt
    if (!finalPrompt.trim()) return

    setIsGenerating(true)
    setError(null)
    setOutput('')

    // Create new abort controller for this generation
    const controller = new AbortController()
    setAbortController(controller)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: finalPrompt,
          settings,
          template: selectedTemplate
        }),
        signal: controller.signal
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error('No response body')

      let fullContent = ''
      
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = new TextDecoder().decode(value)
        const lines = chunk.split('\n')
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))
              if (data.content) {
                fullContent += data.content
                setOutput(fullContent)
              }
            } catch (e) {
              // Skip invalid JSON lines
            }
          }
        }
      }

      // Save to history (local storage)
      const newGeneration: Generation = {
        id: Date.now().toString(),
        content: fullContent,
        timestamp: new Date(),
        template: selectedTemplate,
        settings: { ...settings }
      }
      setHistory(prev => [newGeneration, ...prev.slice(0, 49)]) // Keep last 50

      // Also save to database
      try {
        const response = await fetch('/api/generations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: fullContent,
            type: selectedTemplate,
            prompt: finalPrompt,
            settings: settings
          })
        })
        
        if (!response.ok) {
          const errorData = await response.json()
          console.error('Failed to save to database:', errorData.error)
        } else {
          console.log('Successfully saved generation to database')
        }
      } catch (dbError) {
        console.error('Failed to save to database:', dbError)
        // Continue even if database save fails
      }

      setRetryCount(0)

    } catch (error: any) {
      if (error.name === 'AbortError') {
        setOutput('Generation cancelled.')
        return
      }

      console.error('Generation error:', error)
      setError(error.message)

      // Retry logic with exponential backoff
      if (retryCount < 3) {
        const delay = Math.pow(2, retryCount) * 1000
        setTimeout(() => {
          setRetryCount(prev => prev + 1)
          generateContent(finalPrompt)
        }, delay)
      }
    } finally {
      setIsGenerating(false)
      setAbortController(null)
    }
  }, [prompt, settings, selectedTemplate, retryCount])

  const cancelGeneration = () => {
    if (abortController) {
      abortController.abort()
    }
  }

  const handleCopyToClipboard = async () => {
    if (output) {
      const success = await copyToClipboard(output)
      if (success) {
        // You could add a toast notification here
        console.log('Copied to clipboard')
      }
    }
  }

  const saveGeneration = () => {
    if (output) {
      const newGeneration: Generation = {
        id: Date.now().toString(),
        content: output,
        timestamp: new Date(),
        template: selectedTemplate,
        settings: { ...settings }
      }
      setHistory(prev => [newGeneration, ...prev])
    }
  }

  const handleExportAsTxt = () => {
    if (output) {
      exportAsTxt(output)
    }
  }

  const handleExportAsHtml = () => {
    if (output) {
      exportAsHtml(output)
    }
  }

  const handleExportAsMarkdown = () => {
    if (output) {
      exportAsMarkdown(output)
    }
  }

  const handleExportAsPdf = () => {
    if (output) {
      exportAsPdf(output)
    }
  }

  const loadFromHistory = (generation: Generation) => {
    setOutput(generation.content)
    setSettings(generation.settings)
    setSelectedTemplate(generation.template)
    setShowHistory(false)
  }

  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem('writer-history')
  }

  const applyTemplate = (templateId: string) => {
    const template = TEMPLATES.find(t => t.id === templateId)
    if (template) {
      setPrompt(template.prompt)
      setSelectedTemplate(templateId)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="flex h-screen">
        {/* Sidebar */}
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: showHistory ? 0 : -280 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="w-80 bg-white/95 backdrop-blur-xl shadow-2xl border-r border-slate-200/50 flex flex-col"
        >
          <div className="p-6 border-b border-slate-200/50">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">Templates & History</h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowHistory(!showHistory)}
                className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all duration-200"
              >
                <History className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {showHistory ? (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Recent Generations
                  </h3>
                  <button
                    onClick={clearHistory}
                    className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    Clear
                  </button>
                </div>
                <div className="space-y-3">
                  {history.map((gen) => (
                    <motion.div
                      key={gen.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => loadFromHistory(gen)}
                      className="p-4 bg-gradient-to-r from-slate-50 to-indigo-50 rounded-xl cursor-pointer hover:from-indigo-50 hover:to-blue-50 transition-all duration-200 border border-slate-200/50 hover:border-indigo-200"
                    >
                      <div className="text-sm font-semibold text-slate-800 truncate mb-1">
                        {TEMPLATES.find(t => t.id === gen.template)?.name}
                      </div>
                      <div className="text-xs text-slate-500 mb-2">
                        {gen.timestamp.toLocaleDateString()} {gen.timestamp.toLocaleTimeString()}
                      </div>
                      <div className="text-xs text-slate-600 line-clamp-2">
                        {gen.content.substring(0, 80)}...
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <h3 className="font-semibold text-slate-800 mb-6 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  AI Templates
                </h3>
                <div className="space-y-4">
                  {TEMPLATES.map((template) => {
                    const Icon = template.icon
                    return (
                      <motion.button
                        key={template.id}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => applyTemplate(template.id)}
                        className={`w-full p-4 rounded-xl text-left transition-all duration-200 border-2 ${
                          selectedTemplate === template.id
                            ? 'bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-300 shadow-lg'
                            : 'bg-white border-slate-200 hover:border-indigo-200 hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${template.color} flex items-center justify-center shadow-sm`}>
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                          <span className="font-semibold text-slate-800">{template.name}</span>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed">{template.description}</p>
                      </motion.button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="bg-white/95 backdrop-blur-xl border-b border-slate-200/50 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-800 mb-1">AI Writing Studio</h1>
                <p className="text-slate-600">Professional content generation powered by AI</p>
              </div>
              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowHistory(!showHistory)}
                  className="p-3 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all duration-200"
                >
                  <History className="w-5 h-5" />
                </motion.button>
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Brain className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 flex">
            {/* Prompt Area */}
            <div className="w-1/2 border-r border-slate-200/50 flex flex-col bg-white/50 backdrop-blur-sm">
              <div className="p-6 border-b border-slate-200/50">
                <h3 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
                  <PenTool className="w-4 h-4" />
                  Your Prompt
                </h3>
                <p className="text-sm text-slate-600">Describe what you want to create</p>
              </div>
              <div className="flex-1 p-6">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Enter your writing prompt here. Be specific about what you want to create..."
                  className="w-full h-full resize-none border-2 border-slate-200 rounded-xl p-4 text-slate-700 placeholder-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 bg-white shadow-sm"
                  disabled={isGenerating}
                  style={{ 
                    backgroundColor: '#ffffff',
                    color: '#334155'
                  }}
                />
              </div>
              <div className="p-6 border-t border-slate-200/50 bg-white/80 backdrop-blur-sm">
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: "0 8px 25px rgba(79, 70, 229, 0.3)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => generateContent()}
                    disabled={isGenerating || !prompt.trim()}
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg transition-all duration-200"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5" />
                        Generate Content
                      </>
                    )}
                  </motion.button>
                  
                  {isGenerating && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={cancelGeneration}
                      className="bg-red-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-red-600 flex items-center gap-2 shadow-lg transition-all duration-200"
                    >
                      <Square className="w-4 h-4" />
                      Cancel
                    </motion.button>
                  )}
                </div>
              </div>
            </div>

            {/* Output Area */}
            <div className="w-1/2 flex flex-col bg-white/30 backdrop-blur-sm">
              <div className="p-6 border-b border-slate-200/50">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Generated Content
                  </h3>
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleCopyToClipboard}
                      disabled={!output}
                      className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 disabled:opacity-50"
                      title="Copy to clipboard"
                    >
                      <Copy className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={saveGeneration}
                      disabled={!output}
                      className="p-2 text-slate-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 disabled:opacity-50"
                      title="Save to history"
                    >
                      <Save className="w-4 h-4" />
                    </motion.button>
                    <div className="relative">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowExportMenu(!showExportMenu)}
                        disabled={!output}
                        className="p-2 text-slate-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200 disabled:opacity-50"
                        title="Export options"
                      >
                        <Download className="w-4 h-4" />
                      </motion.button>
                      <AnimatePresence>
                        {showExportMenu && output && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50"
                          >
                            <button
                              onClick={() => { handleExportAsTxt(); setShowExportMenu(false) }}
                              className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                            >
                              <FileText className="w-4 h-4" />
                              Export as TXT
                            </button>
                            <button
                              onClick={() => { handleExportAsHtml(); setShowExportMenu(false) }}
                              className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                            >
                              <FileDown className="w-4 h-4" />
                              Export as HTML
                            </button>
                            <button
                              onClick={() => { handleExportAsMarkdown(); setShowExportMenu(false) }}
                              className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                            >
                              <FileText className="w-4 h-4" />
                              Export as Markdown
                            </button>
                            <button
                              onClick={() => { handleExportAsPdf(); setShowExportMenu(false) }}
                              className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                            >
                              <Download className="w-4 h-4" />
                              Export as PDF
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1 p-6">
                <div
                  ref={outputRef}
                  className="w-full h-full bg-white rounded-xl p-6 overflow-y-auto shadow-sm border border-slate-200"
                >
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                      <div className="font-semibold">Error</div>
                      <div className="text-sm">{error}</div>
                      {retryCount > 0 && (
                        <div className="text-xs mt-2">
                          Retry attempt: {retryCount}/3
                        </div>
                      )}
                    </div>
                  )}
                  {output ? (
                    <AIGenerationDisplay 
                      content={output} 
                      type={selectedTemplate || 'content'}
                      className="!p-0 !shadow-none !border-none"
                    />
                  ) : (
                    <div className="text-slate-400 text-center py-12">
                      <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-2">
                        {isGenerating ? 'Generating your content...' : 'Ready to create'}
                      </p>
                      <p className="text-sm">
                        {isGenerating ? 'Please wait while AI crafts your content' : 'Enter a prompt and click Generate to start'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Panel */}
        <div className="w-80 bg-white/95 backdrop-blur-xl border-l border-slate-200/50 p-6 shadow-sm">
          <h3 className="font-semibold text-slate-800 mb-6 flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Generation Settings
          </h3>
          
          <div className="space-y-6">
            {/* Tone */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">Writing Tone</label>
              <div className="grid grid-cols-2 gap-2">
                {TONES.map(tone => (
                  <motion.button
                    key={tone.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSettings(prev => ({ ...prev, tone: tone.value }))}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      settings.tone === tone.value
                        ? `bg-gradient-to-r ${tone.color} text-white shadow-md`
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {tone.label}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Temperature */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Creativity Level: {settings.temperature.toFixed(1)}
              </label>
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={settings.temperature}
                  onChange={(e) => setSettings(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-2">
                  <span className="flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    Focused
                  </span>
                  <span className="flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    Creative
                  </span>
                </div>
              </div>
            </div>

            {/* Length */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">Content Length</label>
              <div className="space-y-2">
                {LENGTHS.map(length => (
                  <motion.button
                    key={length.value}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setSettings(prev => ({ ...prev, length: length.value }))}
                    className={`w-full p-3 rounded-lg text-left transition-all duration-200 ${
                      settings.length === length.value
                        ? 'bg-indigo-50 border-2 border-indigo-300 text-indigo-800'
                        : 'bg-slate-50 border-2 border-transparent hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{length.icon}</span>
                      <div>
                        <div className="font-medium">{length.value}</div>
                        <div className="text-xs opacity-75">{length.label.split('(')[1]?.replace(')', '')}</div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Current Settings Display */}
            <div className="bg-gradient-to-r from-slate-50 to-indigo-50 rounded-xl p-4 border border-slate-200">
              <h4 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <Award className="w-4 h-4" />
                Current Configuration
              </h4>
              <div className="text-xs text-slate-600 space-y-2">
                <div className="flex justify-between">
                  <span>Template:</span>
                  <span className="font-medium">{TEMPLATES.find(t => t.id === selectedTemplate)?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tone:</span>
                  <span className="font-medium">{settings.tone}</span>
                </div>
                <div className="flex justify-between">
                  <span>Creativity:</span>
                  <span className="font-medium">{settings.temperature}</span>
                </div>
                <div className="flex justify-between">
                  <span>Length:</span>
                  <span className="font-medium">{settings.length}</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-200">
              <h4 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Session Stats
              </h4>
              <div className="text-xs text-slate-600 space-y-2">
                <div className="flex justify-between">
                  <span>Generations:</span>
                  <span className="font-medium">{history.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Words:</span>
                  <span className="font-medium">
                    {history.reduce((sum, gen) => sum + gen.content.split(' ').length, 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Templates Used:</span>
                  <span className="font-medium">
                    {new Set(history.map(gen => gen.template)).size}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}