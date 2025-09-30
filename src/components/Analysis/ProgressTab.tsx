'use client'

import { 
  Target, 
  Calendar, 
  CheckCircle, 
  Clock,
  TrendingUp,
  Award,
  BookOpen,
  Star
} from 'lucide-react'

interface ProgressTabProps {
  className?: string
}

export default function ProgressTab({ className = '' }: ProgressTabProps) {
  const goals = [
    {
      title: 'Write 10,000 words this month',
      progress: 75,
      current: 7500,
      target: 10000,
      deadline: '2024-01-31',
      status: 'on-track'
    },
    {
      title: 'Complete first draft of fantasy novel',
      progress: 45,
      current: 45000,
      target: 100000,
      deadline: '2024-03-15',
      status: 'on-track'
    },
    {
      title: 'Publish 3 short stories',
      progress: 100,
      current: 3,
      target: 3,
      deadline: '2024-01-15',
      status: 'completed'
    },
    {
      title: 'Build 5 character profiles',
      progress: 60,
      current: 3,
      target: 5,
      deadline: '2024-02-28',
      status: 'behind'
    }
  ]

  const milestones = [
    {
      title: 'First 1000 words',
      date: '2024-01-05',
      completed: true,
      icon: BookOpen
    },
    {
      title: 'First character created',
      date: '2024-01-08',
      completed: true,
      icon: Star
    },
    {
      title: 'First AI generation',
      date: '2024-01-10',
      completed: true,
      icon: Award
    },
    {
      title: 'First story published',
      date: '2024-01-15',
      completed: true,
      icon: CheckCircle
    },
    {
      title: '10,000 words milestone',
      date: '2024-01-20',
      completed: false,
      icon: Target
    },
    {
      title: 'First novel chapter',
      date: '2024-01-25',
      completed: false,
      icon: BookOpen
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100'
      case 'on-track': return 'text-blue-600 bg-blue-100'
      case 'behind': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Completed'
      case 'on-track': return 'On Track'
      case 'behind': return 'Behind'
      default: return 'Not Started'
    }
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Goals Overview */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-500" />
          Writing Goals
        </h3>
        <div className="space-y-4">
          {goals.map((goal, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{goal.title}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(goal.status)}`}>
                  {getStatusText(goal.status)}
                </span>
              </div>
              <div className="flex items-center gap-4 mb-2">
                <div className="flex-1">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                    <span>{goal.current.toLocaleString()} / {goal.target.toLocaleString()}</span>
                    <span>{goal.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        goal.status === 'completed' ? 'bg-green-500' :
                        goal.status === 'on-track' ? 'bg-blue-500' :
                        goal.status === 'behind' ? 'bg-red-500' :
                        'bg-gray-400'
                      }`}
                      style={{ width: `${goal.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Deadline: {new Date(goal.deadline).toLocaleDateString()}</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days left
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Milestones Timeline */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-purple-500" />
          Milestones Timeline
        </h3>
        <div className="space-y-4">
          {milestones.map((milestone, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className={`p-2 rounded-full ${
                milestone.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
              }`}>
                <milestone.icon className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <h4 className={`font-medium ${
                  milestone.completed ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {milestone.title}
                </h4>
                <p className="text-sm text-gray-500">
                  {milestone.completed ? 'Completed on ' : 'Due on '}
                  {new Date(milestone.date).toLocaleDateString()}
                </p>
              </div>
              {milestone.completed && (
                <CheckCircle className="w-5 h-5 text-green-500" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Writing Streak */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            Current Streak
          </h4>
          <p className="text-3xl font-bold text-green-600">12 days</p>
          <p className="text-sm text-gray-500">Keep it up!</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-500" />
            This Month
          </h4>
          <p className="text-3xl font-bold text-blue-600">18 days</p>
          <p className="text-sm text-gray-500">out of 31</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
            <Award className="w-4 h-4 text-purple-500" />
            Best Streak
          </h4>
          <p className="text-3xl font-bold text-purple-600">25 days</p>
          <p className="text-sm text-gray-500">Achieved in Dec 2023</p>
        </div>
      </div>

      {/* Progress Chart Placeholder */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Progress</h3>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Progress chart will be displayed here</p>
          </div>
        </div>
      </div>
    </div>
  )
}