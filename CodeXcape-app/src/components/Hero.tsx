'use client'

import { useRouter } from 'next/navigation'

export function Hero() {
  const router = useRouter()

  // FIX: Added proper onClick handlers for both buttons
  const handleGetStarted = () => {
    // Navigate to signup page or onboarding
    router.push('/auth/signup')
  }

  const handleLearnMore = () => {
    // Scroll to features section
    const featuresSection = document.getElementById('features')
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Professional Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-accent-600"></div>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-accent-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/10 rounded-full blur-2xl animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center">
        {/* Main Heading */}
        <h1 className="heading-1 text-white mb-6 animate-fade-in">
          AI Writing Studio
        </h1>
        
        {/* Subtitle */}
        <p className="body-large text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed animate-slide-up">
          Transform your creative ideas into compelling stories with our professional AI-powered writing assistant. 
          Experience real-time generation, smart templates, and seamless collaboration tools.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-scale-in">
          <button 
            onClick={handleGetStarted}
            className="btn btn-accent btn-lg group"
          >
            <span>Start Writing Now</span>
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
          
          <button 
            onClick={handleLearnMore}
            className="btn btn-ghost btn-lg text-white border-white/30 hover:bg-white/10 hover:border-white/50"
          >
            <span>Discover Features</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 flex flex-wrap justify-center items-center gap-8 text-white/70 animate-fade-in">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-accent-400 rounded-full"></div>
            <span className="body-small">10,000+ Writers</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-accent-400 rounded-full"></div>
            <span className="body-small">AI-Powered</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-accent-400 rounded-full"></div>
            <span className="body-small">Professional Tools</span>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  )
}
