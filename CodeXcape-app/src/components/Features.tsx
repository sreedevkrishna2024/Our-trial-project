export function Features() {
  const features = [
    {
      title: "AI-Powered Writing",
      description: "Advanced AI assistance for story generation, character development, and plot structuring",
      icon: "🧠",
      color: "primary"
    },
    {
      title: "Real-time Collaboration",
      description: "Work together with editors, co-writers, and beta readers in real-time",
      icon: "👥",
      color: "accent"
    },
    {
      title: "Smart Templates",
      description: "Professional templates for novels, screenplays, and creative writing projects",
      icon: "📝",
      color: "success"
    },
    {
      title: "Export & Publish",
      description: "Export to multiple formats and publish directly to major platforms",
      icon: "🚀",
      color: "warning"
    },
    {
      title: "Writing Analytics",
      description: "Track your progress, writing habits, and productivity with detailed insights",
      icon: "📊",
      color: "primary"
    },
    {
      title: "Voice Analysis",
      description: "Analyze and improve your unique writing voice with AI-powered feedback",
      icon: "🎤",
      color: "accent"
    }
  ]

  return (
    <section id="features" className="py-24 bg-neutral-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-100 to-accent-100"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="heading-2 mb-4">
            Powerful Features for
            <span className="gradient-text-accent"> Modern Writers</span>
          </h2>
          <p className="body-large text-secondary-600 max-w-2xl mx-auto">
            Everything you need to bring your stories to life, from initial concept to final publication
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="card card-interactive p-8 group animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon */}
              <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-accent-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">{feature.icon}</span>
              </div>

              {/* Content */}
              <h3 className="heading-4 mb-4 group-hover:text-primary-700 transition-colors">
                {feature.title}
              </h3>
              <p className="body-text leading-relaxed">
                {feature.description}
              </p>

              {/* Hover Effect */}
              <div className="mt-6 flex items-center text-accent-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-sm">Learn more</span>
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="card-elevated p-8 max-w-2xl mx-auto">
            <h3 className="heading-3 mb-4">Ready to Start Writing?</h3>
            <p className="body-text mb-6">
              Join thousands of writers who are already creating amazing stories with our AI-powered platform.
            </p>
            <button className="btn btn-primary btn-lg">
              Get Started Free
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
