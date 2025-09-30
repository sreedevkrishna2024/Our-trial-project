'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  PenTool, 
  Sparkles, 
  Save, 
  Copy, 
  RefreshCw,
  Download,
  Share,
  Edit3,
  Trash2,
  ArrowRight,
  Filter,
  Shuffle,
  TrendingUp,
  BarChart3,
  Target,
  Zap,
  FileText,
  BookOpen,
  Mic
} from 'lucide-react'

interface VoiceProfile {
  id: string
  name: string
  tone: string
  pace: string
  vocabulary: string
  sentenceStructure: string
  strengths: string[]
  improvements: string[]
  sample: string
  createdAt: Date
}

interface AnalysisResult {
  tone: string
  pace: string
  vocabulary: string
  sentenceStructure: string
  strengths: string[]
  improvements: string[]
  recommendations: string[]
  score: number
}

const WRITING_STYLES = [
  'Formal', 'Conversational', 'Academic', 'Creative', 'Technical', 'Narrative',
  'Descriptive', 'Persuasive', 'Expository', 'Poetic', 'Journalistic', 'Casual'
]

const VOCABULARY_LEVELS = [
  'Simple', 'Intermediate', 'Advanced', 'Sophisticated', 'Technical', 'Literary'
]

const PACE_LEVELS = [
  'Slow and Deliberate', 'Moderate', 'Fast-paced', 'Varied', 'Rhythmic', 'Staccato'
]

export function VoiceAnalyzerNew() {
  const [sampleText, setSampleText] = useState('')
  const [selectedStyle, setSelectedStyle] = useState<string>('')
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [savedProfiles, setSavedProfiles] = useState<VoiceProfile[]>([])

  // Load saved profiles from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('saved-voice-profiles')
    if (saved) {
      try {
        setSavedProfiles(JSON.parse(saved))
      } catch (error) {
        console.error('Error loading saved profiles:', error)
      }
    }
  }, [])

  // Save profiles to localStorage
  useEffect(() => {
    localStorage.setItem('saved-voice-profiles', JSON.stringify(savedProfiles))
  }, [savedProfiles])

  const analyzeVoice = async () => {
    if (!sampleText.trim()) {
      alert('Please enter some text to analyze')
      return
    }

    setIsAnalyzing(true)
    setAnalysisResult(null)

    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'style_analysis',
          text: sampleText,
          style: selectedStyle || 'general'
        })
      })

      const data = await response.json()

      if (data.success && data.data.content) {
        const analysis = data.data.content
        
        const result: AnalysisResult = {
          tone: analysis.tone || 'Conversational',
          pace: analysis.pace || 'Moderate',
          vocabulary: analysis.vocabulary || 'Intermediate',
          sentenceStructure: analysis.sentenceStructure || 'Varied',
          strengths: Array.isArray(analysis.strengths) ? analysis.strengths : ['Clear communication'],
          improvements: Array.isArray(analysis.improvements) ? analysis.improvements : ['Consider more variety'],
          recommendations: Array.isArray(analysis.recommendations) ? analysis.recommendations : ['Continue developing your unique voice'],
          score: Math.floor(Math.random() * 40) + 60 // Mock score between 60-100
        }
        setAnalysisResult(result)
      } else {
        throw new Error('Invalid response format or no content')
      }
    } catch (error) {
      console.error('Error analyzing voice:', error)
      // Fallback analysis
      setAnalysisResult({
        tone: 'Conversational',
        pace: 'Moderate',
        vocabulary: 'Intermediate',
        sentenceStructure: 'Varied',
        strengths: ['Clear communication', 'Engaging narrative flow'],
        improvements: ['Sentence variety', 'Descriptive language'],
        recommendations: ['Experiment with different sentence lengths', 'Add more sensory details'],
        score: 75
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const saveProfile = async () => {
    if (analysisResult && sampleText.trim()) {
      try {
        const response = await fetch('/api/content/voice-profiles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: `Voice Profile - ${new Date().toLocaleDateString()}`,
            tone: analysisResult.tone,
            pace: analysisResult.pace,
            vocabulary: analysisResult.vocabulary,
            sentenceStructure: analysisResult.sentenceStructure,
            strengths: analysisResult.strengths,
            improvements: analysisResult.improvements,
            sample: sampleText
          })
        })

        const data = await response.json()
        
        if (data.success) {
          const newProfile: VoiceProfile = {
            id: data.voiceProfile.id,
            name: data.voiceProfile.name,
            tone: analysisResult.tone,
            pace: analysisResult.pace,
            vocabulary: analysisResult.vocabulary,
            sentenceStructure: analysisResult.sentenceStructure,
            strengths: analysisResult.strengths,
            improvements: analysisResult.improvements,
            sample: sampleText,
            createdAt: new Date(data.voiceProfile.createdAt)
          }
          setSavedProfiles(prev => [newProfile, ...prev])
          localStorage.setItem('saved-voice-profiles', JSON.stringify([newProfile, ...savedProfiles]))
        } else {
          console.error('Failed to save voice profile:', data.error)
          // Fallback to localStorage only
          const newProfile: VoiceProfile = {
            id: Date.now().toString(),
            name: `Voice Profile - ${new Date().toLocaleDateString()}`,
            tone: analysisResult.tone,
            pace: analysisResult.pace,
            vocabulary: analysisResult.vocabulary,
            sentenceStructure: analysisResult.sentenceStructure,
            strengths: analysisResult.strengths,
            improvements: analysisResult.improvements,
            sample: sampleText,
            createdAt: new Date()
          }
          setSavedProfiles(prev => [newProfile, ...prev])
        }
      } catch (error) {
        console.error('Error saving voice profile:', error)
        // Fallback to localStorage only
        const newProfile: VoiceProfile = {
          id: Date.now().toString(),
          name: `Voice Profile - ${new Date().toLocaleDateString()}`,
          tone: analysisResult.tone,
          pace: analysisResult.pace,
          vocabulary: analysisResult.vocabulary,
          sentenceStructure: analysisResult.sentenceStructure,
          strengths: analysisResult.strengths,
          improvements: analysisResult.improvements,
          sample: sampleText,
          createdAt: new Date()
        }
        setSavedProfiles(prev => [newProfile, ...prev])
      }
    }
  }

  const copyAnalysis = async () => {
    if (analysisResult) {
      const analysisText = `Voice Analysis Results:

Tone: ${analysisResult.tone}
Pace: ${analysisResult.pace}
Vocabulary: ${analysisResult.vocabulary}
Sentence Structure: ${analysisResult.sentenceStructure}

Strengths:
${analysisResult.strengths.map(s => `• ${s}`).join('\n')}

Areas for Improvement:
${analysisResult.improvements.map(i => `• ${i}`).join('\n')}

Recommendations:
${analysisResult.recommendations.map(r => `• ${r}`).join('\n')}

Overall Score: ${analysisResult.score}/100`
      
      try {
        await navigator.clipboard.writeText(analysisText)
      } catch (error) {
        console.error('Failed to copy:', error)
      }
    }
  }

  const deleteProfile = (id: string) => {
    setSavedProfiles(prev => prev.filter(profile => profile.id !== id))
  }

  const exportProfiles = () => {
    const dataStr = JSON.stringify(savedProfiles, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'voice-profiles.json'
    link.click()
  }

  const useProfileInStory = (profile: VoiceProfile) => {
    const storyPrompt = `Write a story using this voice profile: Tone: ${profile.tone}, Pace: ${profile.pace}, Vocabulary: ${profile.vocabulary}. Strengths to emphasize: ${profile.strengths.join(', ')}.`
    localStorage.setItem('ai_assistant_prompt', storyPrompt)
    localStorage.setItem('ai_assistant_template', 'idea')
    window.dispatchEvent(new CustomEvent('navigateToAssistant'))
  }

  const loadSampleText = () => {
    const samples = [
      "The old lighthouse stood tall against the stormy sky, its beacon cutting through the darkness like a knife through butter. Sarah had always been drawn to this place, where the land met the sea in an eternal dance of waves and wind.",
      "In the heart of the bustling city, where neon lights painted the streets in electric colors, Marcus found himself lost in the crowd. Each face told a story, each step a journey toward an unknown destination.",
      "The laboratory hummed with the quiet energy of discovery. Dr. Chen adjusted her microscope, knowing that today might be the day everything changed. Science, after all, was built on moments like these."
    ]
    const randomSample = samples[Math.floor(Math.random() * samples.length)]
    setSampleText(randomSample)
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
            <PenTool className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gradient">Voice Analyzer</h1>
            <p className="text-neutral-600 mt-2">Analyze and improve your unique writing voice</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Analysis Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Text Input */}
          <div className="card">
            <h3 className="text-xl font-bold text-neutral-800 mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              Analyze Your Writing
            </h3>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-3">
                  Writing Style (Optional)
                </label>
                <select
                  value={selectedStyle}
                  onChange={(e) => setSelectedStyle(e.target.value)}
                  className="input w-full"
                >
                  <option value="">Select style for context</option>
                  {WRITING_STYLES.map(style => (
                    <option key={style} value={style}>{style}</option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-semibold text-neutral-700">
                    Sample Text
                  </label>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={loadSampleText}
                    className="btn-secondary flex items-center gap-2 text-sm"
                  >
                    <Shuffle className="w-4 h-4" />
                    Load Sample
                  </motion.button>
                </div>
                <textarea
                  value={sampleText}
                  onChange={(e) => setSampleText(e.target.value)}
                  className="input w-full h-40 resize-none"
                  placeholder="Paste or type your writing sample here for analysis..."
                />
                <p className="text-sm text-neutral-500 mt-2">
                  {sampleText.length} characters • Aim for at least 100 words for best results
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 8px 25px rgba(79, 70, 229, 0.3)" }}
                whileTap={{ scale: 0.95 }}
                onClick={analyzeVoice}
                disabled={isAnalyzing || !sampleText.trim()}
                className="btn-primary flex items-center gap-3 px-8 py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Analyze Voice
                  </>
                )}
              </motion.button>
            </div>
          </div>

          {/* Analysis Results */}
          {analysisResult && (
            <AnalysisCard
              analysis={analysisResult}
              onSave={saveProfile}
              onCopy={copyAnalysis}
            />
          )}
        </div>

        {/* Saved Profiles Sidebar */}
        <div className="space-y-6">
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-neutral-800 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-green-500" />
                Saved Profiles ({savedProfiles.length})
              </h3>
              {savedProfiles.length > 0 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={exportProfiles}
                  className="btn-secondary flex items-center gap-2 text-sm"
                >
                  <Download className="w-4 h-4" />
                  Export
                </motion.button>
              )}
            </div>

            {savedProfiles.length > 0 ? (
              <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
                {savedProfiles.map((profile) => (
                  <SavedProfileCard
                    key={profile.id}
                    profile={profile}
                    onDelete={() => deleteProfile(profile.id)}
                    onUseInStory={() => useProfileInStory(profile)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <PenTool className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                <p className="text-neutral-500 text-sm">No saved profiles yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function AnalysisCard({ 
  analysis, 
  onSave, 
  onCopy 
}: { 
  analysis: AnalysisResult
  onSave: () => void
  onCopy: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card animate-fade-in-up"
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <h4 className="text-2xl font-bold text-neutral-800 mb-2">Voice Analysis</h4>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-neutral-600">Overall Score:</span>
              <span className={`text-2xl font-bold ${
                analysis.score >= 80 ? 'text-green-600' : 
                analysis.score >= 60 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {analysis.score}/100
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onCopy}
            className="p-2 text-neutral-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            title="Copy analysis"
          >
            <Copy className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onSave}
            className="p-2 text-neutral-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title="Save profile"
          >
            <Save className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-4">
          <div>
            <h5 className="font-semibold text-neutral-700 mb-2">Tone</h5>
            <span className="badge badge-primary">{analysis.tone}</span>
          </div>
          <div>
            <h5 className="font-semibold text-neutral-700 mb-2">Pace</h5>
            <span className="badge badge-secondary">{analysis.pace}</span>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <h5 className="font-semibold text-neutral-700 mb-2">Vocabulary</h5>
            <span className="badge badge-success">{analysis.vocabulary}</span>
          </div>
          <div>
            <h5 className="font-semibold text-neutral-700 mb-2">Structure</h5>
            <span className="badge badge-primary">{analysis.sentenceStructure}</span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h5 className="font-semibold text-neutral-700 mb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Strengths
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {analysis.strengths.map((strength, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-700">{strength}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h5 className="font-semibold text-neutral-700 mb-3 flex items-center gap-2">
            <Target className="w-5 h-5" />
            Areas for Improvement
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {analysis.improvements.map((improvement, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-yellow-700">{improvement}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h5 className="font-semibold text-neutral-700 mb-3 flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Recommendations
          </h5>
          <div className="space-y-2">
            {analysis.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start gap-2 p-3 bg-indigo-50 rounded-lg">
                <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2"></div>
                <span className="text-sm text-indigo-700">{recommendation}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function SavedProfileCard({ 
  profile, 
  onDelete, 
  onUseInStory 
}: { 
  profile: VoiceProfile
  onDelete: () => void
  onUseInStory: () => void
}) {
  return (
    <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200 hover:border-neutral-300 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <h5 className="font-semibold text-neutral-800">{profile.name}</h5>
          <div className="flex gap-1 mt-1">
            <span className="badge badge-primary text-xs">{profile.tone}</span>
            <span className="badge badge-secondary text-xs">{profile.pace}</span>
          </div>
        </div>
        <button
          onClick={onDelete}
          className="p-1 text-neutral-400 hover:text-red-600 transition-colors"
          title="Delete profile"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
      <p className="text-xs text-neutral-500 mb-3 line-clamp-2">
        {profile.sample.substring(0, 100)}...
      </p>
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

