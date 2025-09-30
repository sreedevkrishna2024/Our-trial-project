'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageSquare, 
  Sparkles, 
  Save, 
  Copy, 
  RefreshCw,
  Users,
  Download,
  Share,
  Edit3,
  Trash2,
  ArrowRight,
  Filter,
  Shuffle,
  Volume2,
  Mic,
  Play,
  Pause,
  VolumeX
} from 'lucide-react'

interface Dialogue {
  id: string
  title: string
  characters: string[]
  setting: string
  mood: string
  content: string
  genre: string
  createdAt: Date
}

const DIALOGUE_GENRES = [
  'Fantasy', 'Science Fiction', 'Mystery', 'Romance', 'Thriller', 'Horror',
  'Literary Fiction', 'Young Adult', 'Historical Fiction', 'Dystopian', 'Adventure'
]

const MOODS = [
  'Tense', 'Romantic', 'Comedic', 'Dramatic', 'Mysterious', 'Action-packed',
  'Emotional', 'Suspenseful', 'Intimate', 'Confrontational', 'Supportive', 'Playful'
]

const SETTINGS = [
  'Coffee shop', 'Medieval tavern', 'Space station', 'Victorian library', 'Modern office',
  'Ancient temple', 'Future city', 'Quiet garden', 'Stormy night', 'War zone',
  'Family dinner', 'Secret meeting', 'First date', 'Job interview', 'Funeral'
]

export function DialogueCreatorNew() {
  const [selectedGenre, setSelectedGenre] = useState<string>('')
  const [selectedMood, setSelectedMood] = useState<string>('')
  const [selectedSetting, setSelectedSetting] = useState<string>('')
  const [character1, setCharacter1] = useState<string>('')
  const [character2, setCharacter2] = useState<string>('')
  const [generatedDialogue, setGeneratedDialogue] = useState<Dialogue | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [savedDialogues, setSavedDialogues] = useState<Dialogue[]>([])

  // Load saved dialogues from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('saved-dialogues')
    if (saved) {
      try {
        setSavedDialogues(JSON.parse(saved))
      } catch (error) {
        console.error('Error loading saved dialogues:', error)
      }
    }
  }, [])

  // Save dialogues to localStorage
  useEffect(() => {
    localStorage.setItem('saved-dialogues', JSON.stringify(savedDialogues))
  }, [savedDialogues])

  const generateDialogue = async () => {
    if (!character1.trim() || !character2.trim()) {
      alert('Please enter both character names')
      return
    }

    setIsGenerating(true)
    setGeneratedDialogue(null)

    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'dialogue',
          character1: character1,
          character2: character2,
          setting: selectedSetting || 'A quiet room',
          mood: selectedMood || 'conversational',
          genre: selectedGenre || 'general'
        })
      })

      const data = await response.json()

      if (data.success && data.data.content) {
        const newDialogue: Dialogue = {
          id: Date.now().toString(),
          title: `Dialogue between ${character1} and ${character2}`,
          characters: [character1, character2],
          setting: selectedSetting || 'A quiet room',
          mood: selectedMood || 'conversational',
          content: data.data.content,
          genre: selectedGenre || 'General',
          createdAt: new Date()
        }
        setGeneratedDialogue(newDialogue)
      } else {
        throw new Error('Invalid response format or no content')
      }
    } catch (error) {
      console.error('Error generating dialogue:', error)
      // Fallback dialogue
      setGeneratedDialogue({
        id: Date.now().toString(),
        title: `Dialogue between ${character1} and ${character2}`,
        characters: [character1, character2],
        setting: selectedSetting || 'A quiet room',
        mood: selectedMood || 'conversational',
        content: `${character1}: "I've been thinking about what you said earlier."\n\n${character2}: "Oh? What part specifically?"\n\n${character1}: "The part about taking risks. I think you might be right."\n\n${character2}: "I usually am. But I'm curious - what changed your mind?"\n\n${character1}: "Maybe I've been too cautious. Life's too short to always play it safe."\n\n${character2}: "Now that's the spirit I was hoping to hear."`,
        genre: selectedGenre || 'General',
        createdAt: new Date()
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const saveDialogue = async () => {
    if (generatedDialogue) {
      try {
        const response = await fetch('/api/content/dialogues', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: generatedDialogue.title,
            characters: generatedDialogue.characters,
            setting: generatedDialogue.setting,
            mood: generatedDialogue.mood,
            content: generatedDialogue.content,
            genre: generatedDialogue.genre
          })
        })

        const data = await response.json()
        
        if (data.success) {
          const savedDialogue = { ...generatedDialogue, id: data.dialogue.id }
          setSavedDialogues(prev => [savedDialogue, ...prev])
          localStorage.setItem('saved-dialogues', JSON.stringify([savedDialogue, ...savedDialogues]))
        } else {
          console.error('Failed to save dialogue:', data.error)
          const savedDialogue = { ...generatedDialogue, id: `saved-${Date.now()}` }
          setSavedDialogues(prev => [savedDialogue, ...prev])
        }
      } catch (error) {
        console.error('Error saving dialogue:', error)
        const savedDialogue = { ...generatedDialogue, id: `saved-${Date.now()}` }
        setSavedDialogues(prev => [savedDialogue, ...prev])
      }
    }
  }

  const copyDialogue = async () => {
    if (generatedDialogue) {
      const dialogueText = `${generatedDialogue.title}\n\nSetting: ${generatedDialogue.setting}\nMood: ${generatedDialogue.mood}\nGenre: ${generatedDialogue.genre}\n\n${generatedDialogue.content}`
      
      try {
        await navigator.clipboard.writeText(dialogueText)
      } catch (error) {
        console.error('Failed to copy:', error)
      }
    }
  }

  const deleteDialogue = (id: string) => {
    setSavedDialogues(prev => prev.filter(dialogue => dialogue.id !== id))
  }

  const exportDialogues = () => {
    const dataStr = JSON.stringify(savedDialogues, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'dialogues.json'
    link.click()
  }

  const generateRandomDialogue = () => {
    const randomGenre = DIALOGUE_GENRES[Math.floor(Math.random() * DIALOGUE_GENRES.length)]
    const randomMood = MOODS[Math.floor(Math.random() * MOODS.length)]
    const randomSetting = SETTINGS[Math.floor(Math.random() * SETTINGS.length)]
    
    setSelectedGenre(randomGenre)
    setSelectedMood(randomMood)
    setSelectedSetting(randomSetting)
    
    // Generate random character names
    const randomNames = [
      ['Alex', 'Jordan'], ['Sam', 'Taylor'], ['Casey', 'Morgan'], 
      ['Riley', 'Avery'], ['Quinn', 'Sage'], ['River', 'Phoenix']
    ]
    const randomPair = randomNames[Math.floor(Math.random() * randomNames.length)]
    
    setCharacter1(randomPair[0])
    setCharacter2(randomPair[1])
  }

  const useDialogueInStory = (dialogue: Dialogue) => {
    const storyPrompt = `Create a story scene that includes this dialogue: "${dialogue.title}" - ${dialogue.content}. Setting: ${dialogue.setting}. Mood: ${dialogue.mood}.`
    localStorage.setItem('ai_assistant_prompt', storyPrompt)
    localStorage.setItem('ai_assistant_template', 'dialogue')
    window.dispatchEvent(new CustomEvent('navigateToAssistant'))
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gradient">Dialogue Creator</h1>
            <p className="text-neutral-600 mt-2">Craft authentic character conversations with AI</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Generation Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Dialogue Generation */}
          <div className="card">
            <h3 className="text-xl font-bold text-neutral-800 mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              Create Dialogue
            </h3>

            <div className="space-y-6">
              {/* Character Names */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Character 1
                  </label>
                  <input
                    type="text"
                    value={character1}
                    onChange={(e) => setCharacter1(e.target.value)}
                    className="input w-full"
                    placeholder="Enter character name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Character 2
                  </label>
                  <input
                    type="text"
                    value={character2}
                    onChange={(e) => setCharacter2(e.target.value)}
                    className="input w-full"
                    placeholder="Enter character name"
                  />
                </div>
              </div>

              {/* Settings */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Genre
                  </label>
                  <select
                    value={selectedGenre}
                    onChange={(e) => setSelectedGenre(e.target.value)}
                    className="input w-full"
                  >
                    <option value="">Select genre</option>
                    {DIALOGUE_GENRES.map(genre => (
                      <option key={genre} value={genre}>{genre}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Mood
                  </label>
                  <select
                    value={selectedMood}
                    onChange={(e) => setSelectedMood(e.target.value)}
                    className="input w-full"
                  >
                    <option value="">Select mood</option>
                    {MOODS.map(mood => (
                      <option key={mood} value={mood}>{mood}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Setting
                  </label>
                  <input
                    type="text"
                    value={selectedSetting}
                    onChange={(e) => setSelectedSetting(e.target.value)}
                    className="input w-full"
                    placeholder="e.g., Coffee shop, Medieval tavern"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 8px 25px rgba(79, 70, 229, 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={generateDialogue}
                  disabled={isGenerating || !character1.trim() || !character2.trim()}
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
                      Generate Dialogue
                    </>
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={generateRandomDialogue}
                  disabled={isGenerating}
                  className="btn-secondary flex items-center gap-3 px-6 py-4 text-lg disabled:opacity-50"
                >
                  <Shuffle className="w-5 h-5" />
                  Random
                </motion.button>
              </div>
            </div>
          </div>

          {/* Generated Dialogue Display */}
          {generatedDialogue && (
            <DialogueCard
              dialogue={generatedDialogue}
              onSave={saveDialogue}
              onCopy={copyDialogue}
              onUseInStory={() => useDialogueInStory(generatedDialogue)}
              isSaved={savedDialogues.some(saved => saved.title === generatedDialogue.title)}
            />
          )}
        </div>

        {/* Saved Dialogues Sidebar */}
        <div className="space-y-6">
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-neutral-800 flex items-center gap-2">
                <Users className="w-5 h-5 text-green-500" />
                Saved Dialogues ({savedDialogues.length})
              </h3>
              {savedDialogues.length > 0 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={exportDialogues}
                  className="btn-secondary flex items-center gap-2 text-sm"
                >
                  <Download className="w-4 h-4" />
                  Export
                </motion.button>
              )}
            </div>

            {savedDialogues.length > 0 ? (
              <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
                {savedDialogues.map((dialogue) => (
                  <SavedDialogueCard
                    key={dialogue.id}
                    dialogue={dialogue}
                    onDelete={() => deleteDialogue(dialogue.id)}
                    onUseInStory={() => useDialogueInStory(dialogue)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                <p className="text-neutral-500 text-sm">No saved dialogues yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function DialogueCard({ 
  dialogue, 
  onSave, 
  onCopy, 
  onUseInStory, 
  isSaved 
}: { 
  dialogue: Dialogue
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
          <h4 className="text-2xl font-bold text-neutral-800 mb-2">{dialogue.title}</h4>
          <div className="flex items-center gap-3">
            <span className="badge badge-primary">{dialogue.genre}</span>
            <span className="badge badge-secondary">{dialogue.mood}</span>
            <span className="badge badge-success">{dialogue.setting}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onCopy}
            className="p-2 text-neutral-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            title="Copy dialogue"
          >
            <Copy className="w-4 h-4" />
          </motion.button>
          {!isSaved && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onSave}
              className="p-2 text-neutral-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title="Save dialogue"
            >
              <Save className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      </div>

      <div className="bg-neutral-50 p-6 rounded-lg border border-neutral-200">
        <div className="space-y-4">
          {dialogue.content.split('\n\n').map((paragraph, index) => (
            <div key={index} className="text-neutral-700 leading-relaxed">
              {paragraph.split('\n').map((line, lineIndex) => {
                const character = dialogue.characters.find(char => line.startsWith(char + ':'))
                if (character) {
                  return (
                    <div key={lineIndex} className="mb-2">
                      <span className="font-semibold text-indigo-600">{character}:</span>
                      <span className="ml-2">{line.substring(character.length + 1).trim()}</span>
                    </div>
                  )
                }
                return line.trim() && (
                  <div key={lineIndex} className="text-neutral-500 italic text-sm mb-2">
                    {line}
                  </div>
                )
              })}
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
        <MessageSquare className="w-4 h-4" />
        Use in Story
        <ArrowRight className="w-4 h-4" />
      </motion.button>
    </motion.div>
  )
}

function SavedDialogueCard({ 
  dialogue, 
  onDelete, 
  onUseInStory 
}: { 
  dialogue: Dialogue
  onDelete: () => void
  onUseInStory: () => void
}) {
  return (
    <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200 hover:border-neutral-300 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <h5 className="font-semibold text-neutral-800">{dialogue.title}</h5>
          <div className="flex gap-1 mt-1">
            <span className="badge badge-primary text-xs">{dialogue.genre}</span>
            <span className="badge badge-secondary text-xs">{dialogue.mood}</span>
          </div>
        </div>
        <button
          onClick={onDelete}
          className="p-1 text-neutral-400 hover:text-red-600 transition-colors"
          title="Delete dialogue"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
      <p className="text-xs text-neutral-500 mb-3 line-clamp-2">
        {dialogue.content.substring(0, 100)}...
      </p>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onUseInStory}
        className="w-full btn-secondary text-xs py-2 flex items-center justify-center gap-1"
      >
        <MessageSquare className="w-3 h-3" />
        Use in Story
      </motion.button>
    </div>
  )
}

