'use client'

import { 
  HelpCircle, 
  Book, 
  Video, 
  MessageCircle,
  ExternalLink,
  Search,
  ChevronRight,
  Play,
  Download,
  Star
} from 'lucide-react'
import { useState } from 'react'

interface HelpTabProps {
  className?: string
}

export default function HelpTab({ className = '' }: HelpTabProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('getting-started')

  const categories = [
    { id: 'getting-started', name: 'Getting Started', icon: Book },
    { id: 'features', name: 'Features', icon: Star },
    { id: 'troubleshooting', name: 'Troubleshooting', icon: HelpCircle },
    { id: 'api', name: 'API & Integration', icon: ExternalLink }
  ]

  const faqs = [
    {
      category: 'getting-started',
      question: 'How do I create my first story?',
      answer: 'Click on "New Story" in the main dashboard, choose a genre and theme, then start writing or use AI assistance to generate content.',
      helpful: 45
    },
    {
      category: 'getting-started',
      question: 'What AI models are available?',
      answer: 'We support Gemini 2.5 Flash, Gemini 1.5 Pro, and GPT-4. You can change your preferred model in Settings.',
      helpful: 38
    },
    {
      category: 'features',
      question: 'How does the AI character generator work?',
      answer: 'Simply enter a character type (e.g., "vampire", "wizard") and the AI will create a detailed character profile with personality, backstory, and appearance.',
      helpful: 52
    },
    {
      category: 'features',
      question: 'Can I export my stories?',
      answer: 'Yes! You can export your stories in multiple formats including PDF, Word, EPUB, and plain text from the Tools section.',
      helpful: 41
    },
    {
      category: 'troubleshooting',
      question: 'Why is the AI not responding?',
      answer: 'Check your API key in Settings, ensure you have internet connection, and try refreshing the page. If issues persist, contact support.',
      helpful: 67
    },
    {
      category: 'troubleshooting',
      question: 'How do I recover deleted content?',
      answer: 'Deleted content can be recovered from the Trash section in your dashboard for up to 30 days after deletion.',
      helpful: 29
    },
    {
      category: 'api',
      question: 'How do I get an API key?',
      answer: 'Visit the Google AI Studio to get your Gemini API key, then enter it in Settings > API Configuration.',
      helpful: 34
    },
    {
      category: 'api',
      question: 'Is there a rate limit?',
      answer: 'Yes, there are rate limits to ensure fair usage. Free users get 10 requests per minute, Pro users get 50 requests per minute.',
      helpful: 23
    }
  ]

  const tutorials = [
    {
      title: 'Getting Started with AI Writing',
      duration: '5 min',
      type: 'video',
      views: '12.5k',
      rating: 4.8
    },
    {
      title: 'Creating Compelling Characters',
      duration: '8 min',
      type: 'video',
      views: '8.2k',
      rating: 4.9
    },
    {
      title: 'World Building Guide',
      duration: '12 min',
      type: 'video',
      views: '6.7k',
      rating: 4.7
    },
    {
      title: 'Export and Publishing',
      duration: '4 min',
      type: 'video',
      views: '4.1k',
      rating: 4.6
    }
  ]

  const filteredFaqs = faqs.filter(faq => 
    faq.category === selectedCategory && 
    (searchQuery === '' || 
     faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
     faq.answer.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Search className="w-5 h-5 text-blue-500" />
          Search Help
        </h3>
        <div className="relative">
          <input
            type="text"
            placeholder="Search for help articles, FAQs, and tutorials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Help Categories</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                selectedCategory === category.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <category.icon className={`w-6 h-6 mb-2 ${
                selectedCategory === category.id ? 'text-blue-500' : 'text-gray-400'
              }`} />
              <h4 className={`font-medium ${
                selectedCategory === category.id ? 'text-blue-900' : 'text-gray-900'
              }`}>
                {category.name}
              </h4>
            </button>
          ))}
        </div>
      </div>

      {/* FAQs */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Frequently Asked Questions</h3>
        <div className="space-y-4">
          {filteredFaqs.map((faq, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">{faq.question}</h4>
              <p className="text-sm text-gray-600 mb-3">{faq.answer}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600">
                    <Star className="w-4 h-4" />
                    Helpful ({faq.helpful})
                  </button>
                  <button className="text-sm text-gray-500 hover:text-blue-600">
                    Not helpful
                  </button>
                </div>
                <button className="text-sm text-blue-600 hover:text-blue-700">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Tutorials */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Video className="w-5 h-5 text-red-500" />
          Video Tutorials
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tutorials.map((tutorial, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <div className="w-16 h-12 bg-gray-100 rounded flex items-center justify-center">
                  <Play className="w-6 h-6 text-gray-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-1">{tutorial.title}</h4>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{tutorial.duration}</span>
                    <span>{tutorial.views} views</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400" />
                      <span>{tutorial.rating}</span>
                    </div>
                  </div>
                </div>
                <button className="p-1 text-gray-400 hover:text-gray-600">
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Support */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-green-500" />
          Contact Support
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <MessageCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900 mb-1">Live Chat</h4>
            <p className="text-sm text-gray-600 mb-3">Get instant help from our support team</p>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              Start Chat
            </button>
          </div>
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <Book className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900 mb-1">Email Support</h4>
            <p className="text-sm text-gray-600 mb-3">Send us a detailed message</p>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Send Email
            </button>
          </div>
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <ExternalLink className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900 mb-1">Community</h4>
            <p className="text-sm text-gray-600 mb-3">Join our Discord community</p>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
              Join Discord
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex items-center gap-2 p-3 bg-white rounded-lg hover:shadow-md transition-shadow">
            <Download className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium">Download Guide</span>
          </button>
          <button className="flex items-center gap-2 p-3 bg-white rounded-lg hover:shadow-md transition-shadow">
            <Book className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium">Read Docs</span>
          </button>
          <button className="flex items-center gap-2 p-3 bg-white rounded-lg hover:shadow-md transition-shadow">
            <Video className="w-4 h-4 text-red-500" />
            <span className="text-sm font-medium">Watch Demo</span>
          </button>
          <button className="flex items-center gap-2 p-3 bg-white rounded-lg hover:shadow-md transition-shadow">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium">Rate App</span>
          </button>
        </div>
      </div>
    </div>
  )
}