'use client'

import { useState, useEffect } from 'react'
import { 
  BookOpen, 
  Lightbulb, 
  MessageSquare, 
  Target,
  Sparkles,
  Users,
  Zap,
  Star,
  ArrowRight,
  Play,
  CheckCircle,
  Brain,
  PenTool,
  FileText,
  Download,
  Save,
  Copy,
  RefreshCw,
  Shield,
  Clock,
  TrendingUp,
  Award,
  Globe,
  Layers,
  Smartphone,
  ChevronRight,
  Sparkle,
  Bookmark,
  Heart,
  User,
  Share2
} from 'lucide-react'
import Link from 'next/link'

export function LandingPage() {
  const [activeFeature, setActiveFeature] = useState(0)
  const [scrollY, setScrollY] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsVisible(true)
  }, [])

  // FIXED: Added proper onClick handlers for all buttons
  const handleWatchDemo = () => {
    const featuresSection = document.getElementById('features')
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleLearnMore = () => {
    const howItWorksSection = document.getElementById('how-it-works')
    if (howItWorksSection) {
      howItWorksSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // FIXED: Added proper handlers for footer links
  const handleFooterLink = (sectionId: string) => {
    const section = document.getElementById(sectionId)
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const features = [
    {
      icon: Brain,
      title: "Intelligent AI Engine",
      description: "Powered by advanced AI technology for context-aware content generation and creative assistance",
      color: "from-blue-500 to-cyan-600",
      gradient: "bg-gradient-to-br from-blue-50 to-cyan-50",
      delay: "0.1s"
    },
    {
      icon: PenTool,
      title: "Professional Writing Tools",
      description: "Comprehensive suite of tools for character development, plot structuring, and dialogue creation",
      color: "from-amber-500 to-orange-600",
      gradient: "bg-gradient-to-br from-amber-50 to-orange-50",
      delay: "0.2s"
    },
    {
      icon: FileText,
      title: "Seamless Export Options",
      description: "Export your work in multiple professional formats including PDF, DOCX, and EPUB",
      color: "from-emerald-500 to-teal-600",
      gradient: "bg-gradient-to-br from-emerald-50 to-teal-50",
      delay: "0.3s"
    },
    {
      icon: Users,
      title: "Collaborative Workspace",
      description: "Share, collaborate, and get feedback from a community of professional writers",
      color: "from-rose-500 to-pink-600",
      gradient: "bg-gradient-to-br from-rose-50 to-pink-50",
      delay: "0.4s"
    }
  ]

  const stats = [
    { label: "Stories Created", value: "25,000+", icon: BookOpen, color: "blue" },
    { label: "Active Writers", value: "12,000+", icon: Users, color: "amber" },
    { label: "AI Generations", value: "100,000+", icon: Sparkles, color: "emerald" },
    { label: "Success Rate", value: "99.2%", icon: TrendingUp, color: "rose" }
  ]

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Bestselling Author",
      content: "This platform revolutionized my writing process. The AI suggestions are incredibly intelligent and the interface is beautifully designed.",
      avatar: "SC",
      rating: 5,
      delay: "0.1s"
    },
    {
      name: "Michael Rodriguez",
      role: "Screenwriter",
      content: "The character development tools are exceptional. I've created more compelling characters in weeks than I did in months before.",
      avatar: "MR",
      rating: 5,
      delay: "0.2s"
    },
    {
      name: "Emma Thompson",
      role: "Novelist",
      content: "The plot building features helped me structure my story perfectly. This is a game-changer for serious writers.",
      avatar: "ET",
      rating: 5,
      delay: "0.3s"
    }
  ]

  const steps = [
    {
      step: "01",
      title: "Create Your Account",
      description: "Sign up and customize your writing preferences and goals",
      icon: User,
      delay: "0.1s"
    },
    {
      step: "02", 
      title: "Start Your Project",
      description: "Use our AI to generate ideas, characters, or begin writing immediately",
      icon: PenTool,
      delay: "0.2s"
    },
    {
      step: "03",
      title: "Develop & Export",
      description: "Refine your story with AI assistance and export in your preferred format",
      icon: Download,
      delay: "0.3s"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-100 relative overflow-hidden">
      {/* Professional Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-cyan-600/20 rounded-full blur-3xl animate-pulse-subtle"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        />
        <div 
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-amber-400/20 to-orange-600/20 rounded-full blur-3xl animate-pulse-subtle"
          style={{ transform: `translateY(${scrollY * -0.1}px)` }}
        />
        <div 
          className="absolute top-1/2 left-1/2 w-80 h-80 bg-gradient-to-br from-emerald-400/10 to-teal-600/10 rounded-full blur-3xl animate-pulse-subtle"
          style={{ transform: `translate(-50%, -50%) translateY(${scrollY * 0.05}px)` }}
        />
      </div>

      {/* Professional Navigation */}
      <nav className="relative z-10 px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg">
              <PenTool className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-bold gradient-text-ocean">AI Writing Studio</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-slate-600 hover:text-blue-600 transition-colors duration-300 font-medium">Features</a>
            <a href="#how-it-works" className="text-slate-600 hover:text-blue-600 transition-colors duration-300 font-medium">How it Works</a>
            <a href="#testimonials" className="text-slate-600 hover:text-blue-600 transition-colors duration-300 font-medium">Testimonials</a>
            <a href="#pricing" className="text-slate-600 hover:text-blue-600 transition-colors duration-300 font-medium">Pricing</a>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/auth/signin" className="btn-secondary-professional">Sign In</Link>
            <Link href="/auth/signup" className="btn-professional">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-24">
        <div className="max-w-7xl mx-auto text-center">
          <div className={`${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <h1 className="heading-professional-1 mb-8">
              <span className="gradient-text-ocean">Transform Ideas</span>
              <br />
              Into <span className="gradient-text-gold">Compelling Stories</span>
            </h1>
            <p className="body-professional-large mb-12 max-w-4xl mx-auto leading-relaxed text-slate-600">
              The most advanced AI-powered writing platform that helps you create, develop, and perfect your stories with intelligent assistance and professional tools designed for serious writers.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Link href="/auth/signup" className="btn-professional btn-lg group">
                Start Writing Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <button 
                onClick={handleWatchDemo}
                className="btn-accent btn-lg group"
              >
                <Play className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                Watch Demo
              </button>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                <span className="font-medium">No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-500" />
                <span className="font-medium">Secure & Private</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-500" />
                <span className="font-medium">Setup in 2 Minutes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              const colorClasses = {
                blue: 'from-blue-500 to-cyan-600',
                amber: 'from-amber-500 to-orange-600',
                emerald: 'from-emerald-500 to-teal-600',
                rose: 'from-rose-500 to-pink-600'
              }
              return (
                <div 
                  key={index} 
                  className={`card-professional text-center hover-lift animate-fade-in-up`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${colorClasses[stat.color as keyof typeof colorClasses]} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-4xl font-black gradient-text-ocean mb-3">{stat.value}</div>
                  <div className="text-slate-600 font-medium">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 px-6 py-24 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="heading-professional-2 mb-6">
              Everything You Need to <span className="gradient-text-gold">Write Better</span>
            </h2>
            <p className="body-professional-large max-w-3xl mx-auto text-slate-600">
              Powerful AI-driven tools designed to enhance every aspect of your writing journey
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div 
                  key={index} 
                  className={`card-professional hover-lift group animate-fade-in-up`}
                  style={{ animationDelay: feature.delay }}
                >
                  <div className={`w-20 h-20 ${feature.gradient} rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-10 h-10 bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`} />
                  </div>
                  <h3 className="heading-professional-3 mb-4">{feature.title}</h3>
                  <p className="body-professional text-slate-600 leading-relaxed">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative z-10 px-6 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="heading-professional-2 mb-6">
              How It <span className="gradient-text-ocean">Works</span>
            </h2>
            <p className="body-professional-large max-w-3xl mx-auto text-slate-600">
              Get started in minutes and begin creating amazing stories
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <div 
                  key={index} 
                  className="card-elevated-professional text-center hover-lift animate-fade-in-up"
                  style={{ animationDelay: step.delay }}
                >
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl">
                    <Icon className="w-12 h-12 text-white" />
                  </div>
                  <div className="text-6xl font-black text-blue-100 mb-6">{step.step}</div>
                  <h3 className="heading-professional-3 mb-6">{step.title}</h3>
                  <p className="body-professional text-slate-600 leading-relaxed">{step.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="relative z-10 px-6 py-24 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="heading-professional-2 mb-6">
              What Writers Are <span className="gradient-text-gold">Saying</span>
            </h2>
            <p className="body-professional-large max-w-3xl mx-auto text-slate-600">
              Join thousands of satisfied writers who have transformed their craft
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className={`card-elevated-professional hover-lift animate-fade-in-up`}
                style={{ animationDelay: testimonial.delay }}
              >
                <div className="flex items-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl mr-6 shadow-lg">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">{testimonial.name}</h4>
                    <p className="text-slate-600 font-medium">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 text-amber-400 fill-current" />
                  ))}
                </div>
                <p className="body-professional text-slate-600 leading-relaxed">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-24">
        <div className="max-w-5xl mx-auto text-center">
          <div className="card-elevated-professional p-16 bg-gradient-to-br from-blue-600 to-cyan-700 text-white">
            <h2 className="heading-professional-2 mb-8 text-white">
              Ready to Start Your <span className="gradient-text-gold">Writing Journey?</span>
            </h2>
            <p className="body-professional-large mb-12 opacity-90 text-blue-100">
              Join thousands of writers who are already creating amazing stories with AI assistance
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/auth/signup" className="btn-accent btn-xl bg-white text-blue-600 hover:bg-blue-50">
                Get Started Free
                <ArrowRight className="w-6 h-6" />
              </Link>
              <button 
                onClick={handleLearnMore}
                className="btn-secondary-professional btn-xl border-white/20 text-white hover:bg-white/10"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Footer */}
      <footer className="relative z-10 px-6 py-16 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <PenTool className="w-7 h-7 text-white" />
                </div>
                <span className="text-3xl font-bold gradient-text-gold">AI Writing Studio</span>
              </div>
              <p className="body-professional mb-8 max-w-md text-slate-400">
                The most advanced AI-powered writing platform for creating compelling stories and professional content.
              </p>
              <div className="flex space-x-4">
                <button className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors duration-300">
                  <Heart className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors duration-300">
                  <Bookmark className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors duration-300">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div>
              <h3 className="font-bold mb-6 text-lg">Product</h3>
              <ul className="space-y-3 text-slate-400">
                <li><button onClick={() => handleFooterLink('features')} className="hover:text-white transition-colors duration-300 text-left">Features</button></li>
                <li><button onClick={() => handleFooterLink('pricing')} className="hover:text-white transition-colors duration-300 text-left">Pricing</button></li>
                <li><button onClick={() => handleFooterLink('api')} className="hover:text-white transition-colors duration-300 text-left">API</button></li>
                <li><button onClick={() => handleFooterLink('integrations')} className="hover:text-white transition-colors duration-300 text-left">Integrations</button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-6 text-lg">Support</h3>
              <ul className="space-y-3 text-slate-400">
                <li><button onClick={() => handleFooterLink('help')} className="hover:text-white transition-colors duration-300 text-left">Help Center</button></li>
                <li><button onClick={() => handleFooterLink('contact')} className="hover:text-white transition-colors duration-300 text-left">Contact Us</button></li>
                <li><button onClick={() => handleFooterLink('status')} className="hover:text-white transition-colors duration-300 text-left">Status</button></li>
                <li><button onClick={() => handleFooterLink('community')} className="hover:text-white transition-colors duration-300 text-left">Community</button></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400">
            <p>&copy; 2024 AI Writing Studio. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}