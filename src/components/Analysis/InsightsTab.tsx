'use client'

import { 
  Lightbulb, 
  TrendingUp, 
  Target, 
  Clock,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react'

interface InsightsTabProps {
  className?: string
}

export default function InsightsTab({ className = '' }: InsightsTabProps) {
  const insights = [
    {
      title: 'Writing Momentum',
      description: 'You\'re writing 23% more this week compared to last month. Keep up the great work!',
      type: 'positive',
      icon: TrendingUp
    },
    {
      title: 'Peak Writing Time',
      description: 'Your most productive hours are between 2-4 PM. Schedule writing sessions during this time.',
      type: 'info',
      icon: Clock
    },
    {
      title: 'Genre Preference',
      description: 'Fantasy and Sci-Fi are your most written genres. Consider exploring new genres for variety.',
      type: 'suggestion',
      icon: Target
    },
    {
      title: 'AI Usage',
      description: 'You use AI assistance 15% more than the average user. Great for inspiration!',
      type: 'positive',
      icon: BarChart3
    }
  ]

  const writingPatterns = [
    { day: 'Mon', words: 1200, sessions: 3 },
    { day: 'Tue', words: 800, sessions: 2 },
    { day: 'Wed', words: 1500, sessions: 4 },
    { day: 'Thu', words: 900, sessions: 2 },
    { day: 'Fri', words: 1100, sessions: 3 },
    { day: 'Sat', words: 2000, sessions: 5 },
    { day: 'Sun', words: 600, sessions: 1 }
  ]

  const maxWords = Math.max(...writingPatterns.map(p => p.words))

  return (
    <div className={`space-y-6 ${className}`}>
      {/* AI Insights */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          AI-Powered Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((insight, index) => (
            <div key={index} className={`p-4 rounded-lg border-l-4 ${
              insight.type === 'positive' ? 'border-green-500 bg-green-50' :
              insight.type === 'info' ? 'border-blue-500 bg-blue-50' :
              'border-yellow-500 bg-yellow-50'
            }`}>
              <div className="flex items-start gap-3">
                <insight.icon className={`w-5 h-5 mt-0.5 ${
                  insight.type === 'positive' ? 'text-green-600' :
                  insight.type === 'info' ? 'text-blue-600' :
                  'text-yellow-600'
                }`} />
                <div>
                  <h4 className="font-medium text-gray-900">{insight.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Writing Patterns */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-500" />
          Weekly Writing Patterns
        </h3>
        <div className="space-y-4">
          {writingPatterns.map((pattern, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="w-12 text-sm font-medium text-gray-600">{pattern.day}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(pattern.words / maxWords) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-16 text-right">
                    {pattern.words.toLocaleString()}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  {pattern.sessions} session{pattern.sessions !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Productivity Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="font-medium text-gray-900 mb-2">Average Session Length</h4>
          <p className="text-2xl font-bold text-blue-600">45 min</p>
          <p className="text-sm text-gray-500">+5 min from last week</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="font-medium text-gray-900 mb-2">Words per Session</h4>
          <p className="text-2xl font-bold text-green-600">420</p>
          <p className="text-sm text-gray-500">+15 from last week</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="font-medium text-gray-900 mb-2">Consistency Score</h4>
          <p className="text-2xl font-bold text-purple-600">87%</p>
          <p className="text-sm text-gray-500">Excellent!</p>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Personalized Recommendations</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <p className="text-sm text-gray-700">
              Try writing in the morning (8-10 AM) - your creativity peaks during this time.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
            <p className="text-sm text-gray-700">
              Consider setting a daily word count goal of 500 words to maintain momentum.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
            <p className="text-sm text-gray-700">
              Your dialogue writing has improved 30% this month. Keep practicing character development!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}