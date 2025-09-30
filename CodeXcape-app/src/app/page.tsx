'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { LandingPage } from '@/components/LandingPage'
import { OnboardingCheck } from '@/components/OnboardingCheck'

export default function Home() {
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(true)
  const [hasTimedOut, setHasTimedOut] = useState(false)

  useEffect(() => {
    // Set a timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      if (status === 'loading') {
        console.log('Authentication timeout - showing landing page')
        setHasTimedOut(true)
        setIsLoading(false)
      }
    }, 5000) // 5 second timeout

    if (status !== 'loading') {
      clearTimeout(timeout)
      setIsLoading(false)
    }

    return () => clearTimeout(timeout)
  }, [status])

  if (isLoading && !hasTimedOut) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
          <p className="text-sm text-gray-500 mt-2">This may take a moment...</p>
        </div>
      </div>
    )
  }

  // If timed out or no session, show landing page
  if (hasTimedOut || !session) {
    return <LandingPage />
  }

  return <OnboardingCheck />
}