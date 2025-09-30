'use client'

import { 
  BookOpen, 
  TrendingUp, 
  Clock, 
  Target, 
  Star,
  BarChart3,
  Calendar,
  Award
} from 'lucide-react'

interface StatsTabProps {
  totalWords: number
  totalAIGenerations: number
  thisWeekWords: number
  stories: any[]
  className?: string
}

export default function StatsTab({ 
  totalWords, 
  totalAIGenerations, 
  thisWeekWords, 
  stories,
  className = '' 
}: StatsTabProps) {
  const stats = [
    {
      title: 'Total Words Written',
      value: totalWords.toLocaleString(),
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'AI Generations',
      value: totalAIGenerations.toLocaleString(),
      icon: BarChart3,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'This Week',
      value: thisWeekWords.toLocaleString(),
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: '+15%',
      changeType: 'positive'
    },
    {
      title: 'Active Stories',
      value: stories.length.toString(),
      icon: Target,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      change: '+2',
      changeType: 'positive'
    }
  ]

  const recentActivity = [
    { action: 'Generated story idea', time: '2 hours ago', type: 'ai' },
    { action: 'Completed chapter 3', time: '1 day ago', type: 'writing' },
    { action: 'Created character profile', time: '2 days ago', type: 'character' },
    { action: 'Built world setting', time: '3 days ago', type: 'world' }
  ]

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className={`text-sm ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change} from last week
                </p>
              </div>
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Writing Progress */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Writing Progress</h3>
        <div className="space-y-4">
          {stories.slice(0, 3).map((story, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{story.title}</h4>
                <p className="text-sm text-gray-600">{story.genre} • {story.wordCount} words</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${Math.min((story.wordCount / (story.targetWordCount || 50000)) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {Math.round((story.wordCount / (story.targetWordCount || 50000)) * 100)}%
                </p>
                <p className="text-xs text-gray-500">Complete</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${
                activity.type === 'ai' ? 'bg-purple-100' :
                activity.type === 'writing' ? 'bg-blue-100' :
                activity.type === 'character' ? 'bg-green-100' :
                'bg-orange-100'
              }`}>
                {activity.type === 'ai' && <BarChart3 className="w-4 h-4 text-purple-600" />}
                {activity.type === 'writing' && <BookOpen className="w-4 h-4 text-blue-600" />}
                {activity.type === 'character' && <Star className="w-4 h-4 text-green-600" />}
                {activity.type === 'world' && <Award className="w-4 h-4 text-orange-600" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}