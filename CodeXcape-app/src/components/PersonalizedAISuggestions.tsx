'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Sparkles, 
  X, 
  Check, 
  Lightbulb, 
  MessageSquare, 
  Target,
  Globe,
  PenTool,
  Brain,
  ArrowRight,
  Clock,
  Star,
  AlertCircle,
  Zap,
  TrendingUp,
  BookOpen,
  Users,
  Settings
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import { aiPersonalization } from '@/lib/aiPersonalization'

interface PersonalizedSuggestion {
  id: string
  type: string
  title: string
  content: string
  context: string
  priority: string
  personalization: {
    basedOnStyle: boolean
    styleElements: string[]
    genreRelevance: string[]
    goalAlignment: string[]
  }
  createdAt: Date
}

interface UserWritingStyle {
  tone: string
  complexity: string
  pacing: string
  dialogueStyle: string
  experience: string
  favoriteGenres: string[]
  writingGoals: string[]
  interests: string[]
}

export function PersonalizedAISuggestions() {
  const { data: session } = useSession()
  const [suggestions, setSuggestions] = useState<PersonalizedSuggestion[]>([])
  const [userStyle, setUserStyle] = useState<UserWritingStyle | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentSuggestionIndex, setCurrentSuggestionIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (session?.user?.email) {
      loadUserStyle()
      generateInitialSuggestions()
    }
  }, [session])

  const loadUserStyle = async () => {
    try {
      const response = await fetch('/api/user/writing-style')
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setUserStyle(data.style)
        }
      }
    } catch (error) {
      console.error('Error loading user style:', error)
    }
  }

  const generateInitialSuggestions = async () => {
    if (!userStyle) return

    setIsGenerating(true)
    try {
      const suggestions = await Promise.all([
        aiPersonalization.generatePersonalizedSuggestion(
          'Getting started with your writing project',
          userStyle,
          'WRITING_TIP'
        ),
        aiPersonalization.generatePersonalizedSuggestion(
          'Character development for your story',
          userStyle,
          'CHARACTER_SUGGESTION'
        ),
        aiPersonalization.generatePersonalizedSuggestion(
          'Plot structure and pacing',
          userStyle,
          'PLOT_DEVELOPMENT'
        )
      ])

      const suggestionsWithDates = suggestions.map(s => ({
        ...s,
        createdAt: new Date()
      }))

      setSuggestions(suggestionsWithDates)
      setIsVisible(true)
    } catch (error) {
      console.error('Error generating suggestions:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const generateContextualSuggestion = async (context: string, contentType: string) => {
    if (!userStyle) return

    try {
      const newSuggestions = await aiPersonalization.generateContextualSuggestions(
        context,
        userStyle,
        contentType
      )

      const suggestionsWithDates = newSuggestions.map(s => ({
        ...s,
        createdAt: new Date()
      }))

      setSuggestions(prev => [...suggestionsWithDates, ...prev])
      setIsVisible(true)
    } catch (error) {
      console.error('Error generating contextual suggestion:', error)
    }
  }

  const dismissSuggestion = (id: string) => {
    setSuggestions(prev => prev.filter(s => s.id !== id))
    if (suggestions.length === 1) {
      setIsVisible(false)
    } else {
      setCurrentSuggestionIndex(0)
    }
  }

  const markAsRead = async (id: string) => {
    setSuggestions(prev => prev.map(s => 
      s.id === id ? { ...s, isRead: true } : s
    ))

    try {
      await fetch(`/api/ai-suggestions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: true })
      })
    } catch (error) {
      console.error('Error marking suggestion as read:', error)
    }
  }

  const applySuggestion = (suggestion: PersonalizedSuggestion) => {
    // Handle suggestion application based on type
    switch (suggestion.type) {
      case 'WRITING_TIP':
        // Navigate to AI Assistant with tip
        localStorage.setItem('ai_assistant_prompt', suggestion.content)
        localStorage.setItem('ai_assistant_template', 'general')
        window.dispatchEvent(new CustomEvent('navigateToAssistant'))
        break
      case 'CHARACTER_SUGGESTION':
        // Navigate to Character Builder
        window.dispatchEvent(new CustomEvent('navigateToCharacterBuilder'))
        break
      case 'PLOT_DEVELOPMENT':
        // Navigate to Plot Builder
        window.dispatchEvent(new CustomEvent('navigateToPlotBuilder'))
        break
      case 'WORLD_BUILDING':
        // Navigate to World Builder
        window.dispatchEvent(new CustomEvent('navigateToWorldBuilder'))
        break
      default:
        // Navigate to AI Assistant
        localStorage.setItem('ai_assistant_prompt', suggestion.content)
        window.dispatchEvent(new CustomEvent('navigateToAssistant'))
    }
  }

  const currentSuggestion = suggestions[currentSuggestionIndex]

  if (!isVisible || !currentSuggestion || !userStyle) {
    return null
  }

  const suggestionType = SUGGESTION_TYPES[currentSuggestion.type as keyof typeof SUGGESTION_TYPES] || SUGGESTION_TYPES.WRITING_TIP
  const IconComponent = suggestionType.icon

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 400, scale: 0.9 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 400, scale: 0.9 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed top-4 right-4 z-50 w-96 max-w-[calc(100vw-2rem)]"
      >
        <div className={`${suggestionType.bgColor} ${suggestionType.borderColor} border-2 rounded-2xl shadow-2xl backdrop-blur-sm overflow-hidden`}>
          {/* Header */}
          <div className="p-4 border-b border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${suggestionType.color} flex items-center justify-center`}>
                  <IconComponent className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">Personalized AI Suggestion</h3>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium ${PRIORITY_COLORS[currentSuggestion.priority as keyof typeof PRIORITY_COLORS]}`}>
                      {currentSuggestion.priority}
                    </span>
                    <span className="text-xs text-slate-500">
                      {new Date(currentSuggestion.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => dismissSuggestion(currentSuggestion.id)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-slate-600" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <h4 className="font-bold text-slate-800 mb-2">{currentSuggestion.title}</h4>
            <p className="text-slate-700 text-sm leading-relaxed mb-4">
              {currentSuggestion.content}
            </p>
            
            {/* Personalization Info */}
            <div className="bg-white/50 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-4 h-4 text-slate-600" />
                <span className="text-xs font-medium text-slate-600">Personalized for You</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-600">Style:</span>
                  <span className="text-slate-800 font-medium">{userStyle.tone} • {userStyle.complexity}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-600">Genre:</span>
                  <span className="text-slate-800 font-medium">{userStyle.favoriteGenres[0] || 'General'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-600">Goals:</span>
                  <span className="text-slate-800 font-medium">{userStyle.writingGoals[0] || 'Improve writing'}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => applySuggestion(currentSuggestion)}
                className={`flex-1 bg-gradient-to-r ${suggestionType.color} text-white px-4 py-2 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 hover:shadow-lg transition-all duration-200`}
              >
                <Check className="w-4 h-4" />
                Apply Suggestion
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => markAsRead(currentSuggestion.id)}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors text-sm font-medium"
              >
                Mark Read
              </motion.button>
            </div>
          </div>

          {/* Navigation */}
          {suggestions.length > 1 && (
            <div className="px-4 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">
                    {currentSuggestionIndex + 1} of {suggestions.length}
                  </span>
                  <div className="flex gap-1">
                    {suggestions.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentSuggestionIndex ? 'bg-slate-600' : 'bg-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-1">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setCurrentSuggestionIndex(prev => 
                      prev > 0 ? prev - 1 : suggestions.length - 1
                    )}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <ArrowRight className="w-3 h-3 text-slate-600 rotate-180" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setCurrentSuggestionIndex(prev => 
                      prev < suggestions.length - 1 ? prev + 1 : 0
                    )}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <ArrowRight className="w-3 h-3 text-slate-600" />
                  </motion.button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Notification Badge */}
        {suggestions.length > 1 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg"
          >
            {suggestions.length}
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

const SUGGESTION_TYPES = {
  WRITING_TIP: { icon: Lightbulb, color: 'from-yellow-500 to-orange-500', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' },
  CHARACTER_SUGGESTION: { icon: MessageSquare, color: 'from-blue-500 to-cyan-500', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
  PLOT_DEVELOPMENT: { icon: Target, color: 'from-purple-500 to-pink-500', bgColor: 'bg-purple-50', borderColor: 'border-purple-200' },
  WORLD_BUILDING: { icon: Globe, color: 'from-green-500 to-emerald-500', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
  STYLE_IMPROVEMENT: { icon: PenTool, color: 'from-indigo-500 to-purple-500', bgColor: 'bg-indigo-50', borderColor: 'border-indigo-200' },
  CREATIVE_INSPIRATION: { icon: Sparkles, color: 'from-pink-500 to-rose-500', bgColor: 'bg-pink-50', borderColor: 'border-pink-200' }
}

const PRIORITY_COLORS = {
  LOW: 'text-slate-500',
  MEDIUM: 'text-blue-600',
  HIGH: 'text-orange-600',
  URGENT: 'text-red-600'
}
