'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, 
  FileText, 
  Brain, 
  Target, 
  ArrowRight, 
  ArrowLeft,
  Upload,
  Check,
  Sparkles,
  BookOpen,
  PenTool,
  Lightbulb,
  Globe,
  Heart,
  Zap
} from 'lucide-react'

interface OnboardingData {
  writingExperience: string
  favoriteGenres: string[]
  writingGoals: string[]
  previousWorks: string
  writingStyle: {
    tone: string
    complexity: string
    pacing: string
    dialogueStyle: string
  }
  interests: string[]
}

const WRITING_EXPERIENCE = [
  { value: 'BEGINNER', label: 'Just starting out', description: 'New to creative writing', icon: '🌱' },
  { value: 'INTERMEDIATE', label: 'Some experience', description: 'Written a few stories', icon: '📝' },
  { value: 'ADVANCED', label: 'Regular writer', description: 'Write frequently', icon: '✍️' },
  { value: 'PROFESSIONAL', label: 'Professional', description: 'Published or aspiring author', icon: '🏆' }
]

const GENRES = [
  'Fantasy', 'Science Fiction', 'Mystery', 'Romance', 'Thriller', 'Horror',
  'Literary Fiction', 'Young Adult', 'Historical Fiction', 'Dystopian', 
  'Adventure', 'Crime', 'Comedy', 'Drama', 'Action', 'Supernatural'
]

const WRITING_GOALS = [
  'Complete my first novel', 'Improve character development', 'Master dialogue writing',
  'Build a consistent writing habit', 'Get published', 'Explore different genres',
  'Develop my unique voice', 'Create compelling plots', 'Build a writing community',
  'Learn world-building techniques'
]

const WRITING_STYLES = {
  tone: [
    { value: 'FORMAL', label: 'Formal & Academic', description: 'Precise, scholarly tone' },
    { value: 'CASUAL', label: 'Casual & Conversational', description: 'Friendly, approachable style' },
    { value: 'POETIC', label: 'Poetic & Lyrical', description: 'Beautiful, flowing prose' },
    { value: 'DRAMATIC', label: 'Dramatic & Intense', description: 'High emotion, powerful impact' },
    { value: 'HUMOROUS', label: 'Witty & Humorous', description: 'Light-hearted, entertaining' }
  ],
  complexity: [
    { value: 'SIMPLE', label: 'Simple & Clear', description: 'Easy to read and understand' },
    { value: 'MODERATE', label: 'Moderate Complexity', description: 'Balanced sophistication' },
    { value: 'COMPLEX', label: 'Complex & Rich', description: 'Intricate, layered prose' }
  ],
  pacing: [
    { value: 'FAST', label: 'Fast-paced', description: 'Quick action, rapid progression' },
    { value: 'MODERATE', label: 'Steady pace', description: 'Balanced rhythm' },
    { value: 'SLOW', label: 'Slow & Deliberate', description: 'Thoughtful, detailed exploration' }
  ],
  dialogueStyle: [
    { value: 'NATURAL', label: 'Natural Speech', description: 'Realistic conversations' },
    { value: 'STYLIZED', label: 'Stylized & Artistic', description: 'Poetic, crafted dialogue' },
    { value: 'MINIMAL', label: 'Minimal & Direct', description: 'Concise, to the point' }
  ]
}

const INTERESTS = [
  'Character Development', 'Plot Structure', 'World Building', 'Dialogue Writing',
  'Descriptive Writing', 'Pacing', 'Genre Exploration', 'Voice Development',
  'Research Methods', 'Editing Techniques', 'Publishing Process', 'Marketing'
]

export function UserOnboarding({ onComplete }: { onComplete: (data: OnboardingData) => void }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [data, setData] = useState<OnboardingData>({
    writingExperience: '',
    favoriteGenres: [],
    writingGoals: [],
    previousWorks: '',
    writingStyle: {
      tone: '',
      complexity: '',
      pacing: '',
      dialogueStyle: ''
    },
    interests: []
  })

  const steps = [
    {
      id: 'welcome',
      title: 'Welcome to Your Writing Journey!',
      description: 'Let\'s personalize your experience',
      component: WelcomeStep
    },
    {
      id: 'experience',
      title: 'Your Writing Experience',
      description: 'Tell us about your writing background',
      component: ExperienceStep
    },
    {
      id: 'genres',
      title: 'Favorite Genres',
      description: 'What types of stories do you love?',
      component: GenresStep
    },
    {
      id: 'goals',
      title: 'Writing Goals',
      description: 'What do you want to achieve?',
      component: GoalsStep
    },
    {
      id: 'style',
      title: 'Writing Style Preferences',
      description: 'Help us understand your voice',
      component: StyleStep
    },
    {
      id: 'works',
      title: 'Previous Works (Optional)',
      description: 'Share any existing writing for analysis',
      component: WorksStep
    },
    {
      id: 'interests',
      title: 'Areas of Interest',
      description: 'What would you like to improve?',
      component: InterestsStep
    },
    {
      id: 'complete',
      title: 'All Set!',
      description: 'Your personalized experience is ready',
      component: CompleteStep
    }
  ]

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    onComplete(data)
  }

  const CurrentComponent = steps[currentStep].component

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl"
      >
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm text-slate-500">
              {Math.round(((currentStep + 1) / steps.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              {steps[currentStep].title}
            </h1>
            <p className="text-slate-600">
              {steps[currentStep].description}
            </p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <CurrentComponent 
                data={data} 
                setData={setData} 
                onNext={nextStep}
                onPrev={prevStep}
                onComplete={handleComplete}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}

function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="text-center space-y-6">
      <div className="w-24 h-24 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto">
        <Sparkles className="w-12 h-12 text-white" />
      </div>
      
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">
          Let's Create Your Perfect Writing Experience
        </h2>
        <p className="text-slate-600 max-w-2xl mx-auto">
          We'll ask you a few questions to understand your writing style, preferences, and goals. 
          This helps us provide personalized suggestions and create content that matches your voice.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
          <Brain className="w-6 h-6 text-indigo-600" />
          <span className="font-medium text-slate-700">AI-Powered Analysis</span>
        </div>
        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
          <Target className="w-6 h-6 text-purple-600" />
          <span className="font-medium text-slate-700">Personalized Suggestions</span>
        </div>
        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
          <Heart className="w-6 h-6 text-pink-600" />
          <span className="font-medium text-slate-700">Your Unique Voice</span>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onNext}
        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex items-center gap-2 mx-auto"
      >
        Get Started <ArrowRight className="w-5 h-5" />
      </motion.button>
    </div>
  )
}

function ExperienceStep({ data, setData, onNext, onPrev }: {
  data: OnboardingData
  setData: (data: OnboardingData) => void
  onNext: () => void
  onPrev: () => void
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {WRITING_EXPERIENCE.map((exp) => (
          <motion.button
            key={exp.value}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setData({ ...data, writingExperience: exp.value })}
            className={`p-6 rounded-xl border-2 transition-all duration-200 text-left ${
              data.writingExperience === exp.value
                ? 'border-indigo-500 bg-indigo-50 text-indigo-800'
                : 'border-slate-200 bg-white hover:border-indigo-300 text-slate-700'
            }`}
          >
            <div className="flex items-start gap-4">
              <span className="text-3xl">{exp.icon}</span>
              <div>
                <h3 className="font-semibold text-lg mb-1">{exp.label}</h3>
                <p className="text-sm opacity-75">{exp.description}</p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      <div className="flex justify-between">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onPrev}
          className="px-6 py-3 text-slate-600 hover:text-slate-800 transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNext}
          disabled={!data.writingExperience}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  )
}

function GenresStep({ data, setData, onNext, onPrev }: {
  data: OnboardingData
  setData: (data: OnboardingData) => void
  onNext: () => void
  onPrev: () => void
}) {
  const toggleGenre = (genre: string) => {
    setData({
      ...data,
      favoriteGenres: data.favoriteGenres.includes(genre)
        ? data.favoriteGenres.filter(g => g !== genre)
        : [...data.favoriteGenres, genre]
    })
  }

  return (
    <div className="space-y-6">
      <p className="text-slate-600 text-center">
        Select all genres you enjoy reading or writing (you can choose multiple)
      </p>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {GENRES.map((genre) => (
          <motion.button
            key={genre}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => toggleGenre(genre)}
            className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
              data.favoriteGenres.includes(genre)
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {genre}
          </motion.button>
        ))}
      </div>

      <div className="flex justify-between">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onPrev}
          className="px-6 py-3 text-slate-600 hover:text-slate-800 transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNext}
          disabled={data.favoriteGenres.length === 0}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  )
}

function GoalsStep({ data, setData, onNext, onPrev }: {
  data: OnboardingData
  setData: (data: OnboardingData) => void
  onNext: () => void
  onPrev: () => void
}) {
  const toggleGoal = (goal: string) => {
    setData({
      ...data,
      writingGoals: data.writingGoals.includes(goal)
        ? data.writingGoals.filter(g => g !== goal)
        : [...data.writingGoals, goal]
    })
  }

  return (
    <div className="space-y-6">
      <p className="text-slate-600 text-center">
        What are your main writing goals? (Select all that apply)
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {WRITING_GOALS.map((goal) => (
          <motion.button
            key={goal}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => toggleGoal(goal)}
            className={`p-4 rounded-lg text-left transition-all duration-200 ${
              data.writingGoals.includes(goal)
                ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-lg'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <div className="flex items-center gap-3">
              {data.writingGoals.includes(goal) && (
                <Check className="w-5 h-5 flex-shrink-0" />
              )}
              <span className="font-medium">{goal}</span>
            </div>
          </motion.button>
        ))}
      </div>

      <div className="flex justify-between">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onPrev}
          className="px-6 py-3 text-slate-600 hover:text-slate-800 transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNext}
          disabled={data.writingGoals.length === 0}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  )
}

function StyleStep({ data, setData, onNext, onPrev }: {
  data: OnboardingData
  setData: (data: OnboardingData) => void
  onNext: () => void
  onPrev: () => void
}) {
  const updateStyle = (key: keyof typeof data.writingStyle, value: string) => {
    setData({
      ...data,
      writingStyle: {
        ...data.writingStyle,
        [key]: value
      }
    })
  }

  const renderStyleOptions = (type: keyof typeof WRITING_STYLES, title: string) => (
    <div className="space-y-3">
      <h3 className="font-semibold text-slate-800">{title}</h3>
      <div className="grid grid-cols-1 gap-2">
        {WRITING_STYLES[type].map((option) => (
          <motion.button
            key={option.value}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => updateStyle(type, option.value)}
            className={`p-3 rounded-lg text-left transition-all duration-200 ${
              data.writingStyle[type] === option.value
                ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <div className="font-medium">{option.label}</div>
            <div className="text-sm opacity-75">{option.description}</div>
          </motion.button>
        ))}
      </div>
    </div>
  )

  return (
    <div className="space-y-8">
      <p className="text-slate-600 text-center">
        Help us understand your preferred writing style
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {renderStyleOptions('tone', 'Tone & Voice')}
        {renderStyleOptions('complexity', 'Complexity Level')}
        {renderStyleOptions('pacing', 'Story Pacing')}
        {renderStyleOptions('dialogueStyle', 'Dialogue Style')}
      </div>

      <div className="flex justify-between">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onPrev}
          className="px-6 py-3 text-slate-600 hover:text-slate-800 transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNext}
          disabled={!data.writingStyle.tone || !data.writingStyle.complexity || !data.writingStyle.pacing || !data.writingStyle.dialogueStyle}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  )
}

function WorksStep({ data, setData, onNext, onPrev }: {
  data: OnboardingData
  setData: (data: OnboardingData) => void
  onNext: () => void
  onPrev: () => void
}) {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setData({ ...data, previousWorks: e.target?.result as string })
      }
      reader.readAsText(file)
    }
  }

  return (
    <div className="space-y-6">
      <p className="text-slate-600 text-center">
        Upload any previous writing works for AI analysis (optional)
      </p>
      
      <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center">
        <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <h3 className="font-semibold text-slate-700 mb-2">Upload Your Writing</h3>
        <p className="text-slate-500 mb-4">
          Upload a text file (.txt, .docx) or paste your writing below
        </p>
        
        <input
          type="file"
          accept=".txt,.docx"
          onChange={handleFileUpload}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors cursor-pointer inline-block"
        >
          Choose File
        </label>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700">
          Or paste your writing here:
        </label>
        <textarea
          className="w-full p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          rows={8}
          placeholder="Paste your previous writing here for AI analysis..."
          value={data.previousWorks}
          onChange={(e) => setData({ ...data, previousWorks: e.target.value })}
        />
      </div>

      <div className="flex justify-between">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onPrev}
          className="px-6 py-3 text-slate-600 hover:text-slate-800 transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNext}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center gap-2"
        >
          Next <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  )
}

function InterestsStep({ data, setData, onNext, onPrev }: {
  data: OnboardingData
  setData: (data: OnboardingData) => void
  onNext: () => void
  onPrev: () => void
}) {
  const toggleInterest = (interest: string) => {
    setData({
      ...data,
      interests: data.interests.includes(interest)
        ? data.interests.filter(i => i !== interest)
        : [...data.interests, interest]
    })
  }

  return (
    <div className="space-y-6">
      <p className="text-slate-600 text-center">
        What aspects of writing would you like to focus on? (Select all that interest you)
      </p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {INTERESTS.map((interest) => (
          <motion.button
            key={interest}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => toggleInterest(interest)}
            className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
              data.interests.includes(interest)
                ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {interest}
          </motion.button>
        ))}
      </div>

      <div className="flex justify-between">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onPrev}
          className="px-6 py-3 text-slate-600 hover:text-slate-800 transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNext}
          disabled={data.interests.length === 0}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  )
}

function CompleteStep({ data, onComplete }: {
  data: OnboardingData
  onComplete: () => void
}) {
  return (
    <div className="text-center space-y-6">
      <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto">
        <Check className="w-12 h-12 text-white" />
      </div>
      
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">
          Perfect! Your Profile is Ready
        </h2>
        <p className="text-slate-600 max-w-2xl mx-auto">
          We've analyzed your preferences and created a personalized writing experience just for you. 
          Our AI will now provide suggestions that match your unique style and goals.
        </p>
      </div>

      <div className="bg-slate-50 rounded-xl p-6 text-left max-w-md mx-auto">
        <h3 className="font-semibold text-slate-800 mb-3">Your Profile Summary:</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-600">Experience:</span>
            <span className="font-medium">{WRITING_EXPERIENCE.find(e => e.value === data.writingExperience)?.label}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Favorite Genres:</span>
            <span className="font-medium">{data.favoriteGenres.length} selected</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Writing Goals:</span>
            <span className="font-medium">{data.writingGoals.length} goals</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Interests:</span>
            <span className="font-medium">{data.interests.length} areas</span>
          </div>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onComplete}
        className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex items-center gap-2 mx-auto"
      >
        <Zap className="w-5 h-5" />
        Start Writing!
      </motion.button>
    </div>
  )
}
