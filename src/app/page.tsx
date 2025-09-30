'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { LandingPage } from '@/components/LandingPage'
import { OnboardingCheck } from '@/components/OnboardingCheck'

export default function Home() {
  // Temporarily bypass authentication for testing
  return <LandingPage />
}