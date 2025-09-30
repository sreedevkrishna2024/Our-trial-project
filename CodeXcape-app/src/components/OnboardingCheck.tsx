'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { UserOnboarding } from './UserOnboarding'
import { WritingDashboard } from './WritingDashboard'

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

export function OnboardingCheck() {
  const { data: session, status } = useSession()
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.email) {
      checkOnboardingStatus()
    } else if (status === 'unauthenticated') {
      // For testing purposes, still check onboarding status even without auth
      checkOnboardingStatus()
    }
  }, [status, session])

  const checkOnboardingStatus = async () => {
    try {
      const response = await fetch('/api/user/onboarding-status')
      if (response.ok) {
        const data = await response.json()
        setHasCompletedOnboarding(data.completed)
      } else {
        setHasCompletedOnboarding(false)
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error)
      setHasCompletedOnboarding(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOnboardingComplete = async (data: OnboardingData) => {
    try {
      console.log('Completing onboarding with data:', data)
      const response = await fetch('/api/user/complete-onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        console.log('Onboarding completed successfully')
        setHasCompletedOnboarding(true)
        // Force a page refresh to ensure state is properly updated
        window.location.reload()
      } else {
        const errorData = await response.json()
        console.error('Failed to save onboarding data:', errorData)
        alert(`Failed to complete onboarding: ${errorData.details || errorData.error || 'Unknown error'}. Please try again.`)
      }
    } catch (error) {
      console.error('Error completing onboarding:', error)
      alert('An error occurred while completing onboarding. Please try again.')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Setting up your personalized experience...</p>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated' && hasCompletedOnboarding === null) {
    return null
  }

  if (hasCompletedOnboarding === false) {
    return <UserOnboarding onComplete={handleOnboardingComplete} />
  }

  if (hasCompletedOnboarding === true) {
    return <WritingDashboard />
  }

  return null
}
