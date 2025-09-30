'use client'

import { useState, useRef, useEffect } from 'react'
// import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageSquare, 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Copy, 
  Trash2, 
  Download,
  Settings,
  RefreshCw,
  Zap,
  Lightbulb,
  BookOpen,
  Target,
  Users,
  PenTool
} from 'lucide-react'
import { MarkdownRenderer } from './MarkdownRenderer'

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
}

interface ChatSession {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
}

const QUICK_PROMPTS = [
  { 
    icon: Lightbulb, 
    text: 'Write a story', 
    prompt: 'Write a short story about a vampire' 
  },
  { 
    icon: BookOpen, 
    text: 'Create a character', 
    prompt: 'Create a detailed character profile for a detective' 
  },
  { 
    icon: Target, 
    text: 'Write dialogue', 
    prompt: 'Write a dialogue between two friends meeting after years' 
  },
  { 
    icon: Users, 
    text: 'Develop a plot', 
    prompt: 'Create a plot outline for a mystery novel' 
  },
  { 
    icon: PenTool, 
    text: 'Build a world', 
    prompt: 'Describe a fantasy world with magic and dragons' 
  },
  { 
    icon: Zap, 
    text: 'Writing help', 
    prompt: 'Help me improve my writing skills' 
  }
]

export function ChatBotNew() {
  const [currentMessage, setCurrentMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([])
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Load chat sessions from database
  useEffect(() => {
    const loadChatSessions = async () => {
      try {
        const response = await fetch('/api/content/chat-sessions', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        })

        if (response.ok) {
          const data = await response.json()
          if (data.success && data.data) {
            const sessions = data.data.map((session: any) => ({
              ...session,
              messages: JSON.parse(session.messages).map((msg: any) => ({
                ...msg,
                timestamp: new Date(msg.timestamp)
              })),
              createdAt: new Date(session.createdAt)
            }))
            setChatSessions(sessions)
            
            // Load the most recent session if no current session
            if (sessions.length > 0 && !currentSessionId) {
              setCurrentSessionId(sessions[0].id)
              setMessages(sessions[0].messages)
            }
          }
        } else {
          console.error('Failed to load chat sessions:', response.status)
          // Fallback to localStorage if API fails
          const saved = localStorage.getItem('chat-sessions')
          if (saved) {
            try {
              const sessions = JSON.parse(saved).map((session: any) => ({
                ...session,
                messages: session.messages.map((msg: any) => ({
                  ...msg,
                  timestamp: new Date(msg.timestamp)
                })),
                createdAt: new Date(session.createdAt)
              }))
              setChatSessions(sessions)
              
              if (sessions.length > 0 && !currentSessionId) {
                setCurrentSessionId(sessions[0].id)
                setMessages(sessions[0].messages)
              }
            } catch (error) {
              console.error('Error loading chat sessions from localStorage:', error)
            }
          }
        }
      } catch (error) {
        console.error('Error loading chat sessions:', error)
        // Fallback to localStorage if API fails
        const saved = localStorage.getItem('chat-sessions')
        if (saved) {
          try {
            const sessions = JSON.parse(saved).map((session: any) => ({
              ...session,
              messages: session.messages.map((msg: any) => ({
                ...msg,
                timestamp: new Date(msg.timestamp)
              })),
              createdAt: new Date(session.createdAt)
            }))
            setChatSessions(sessions)
            
            if (sessions.length > 0 && !currentSessionId) {
              setCurrentSessionId(sessions[0].id)
              setMessages(sessions[0].messages)
            }
          } catch (error) {
            console.error('Error loading chat sessions from localStorage:', error)
          }
        }
      }
    }

    loadChatSessions()
  }, [])

  // Save chat sessions to localStorage
  useEffect(() => {
    if (chatSessions.length > 0) {
      localStorage.setItem('chat-sessions', JSON.stringify(chatSessions))
    }
  }, [chatSessions])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (messageText?: string) => {
    const text = messageText || currentMessage.trim()
    if (!text) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: text,
      timestamp: new Date()
    }

    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setCurrentMessage('')
    setIsTyping(true)

    // Create or update session
    let sessionId = currentSessionId
    if (!sessionId) {
      sessionId = Date.now().toString()
      setCurrentSessionId(sessionId)
    }

    // **CRITICAL: Direct Response Assistant**
    const systemMessage = "You are a helpful AI assistant. Answer all questions directly and completely. When users ask you to write something (like a story, poem, dialogue, etc.), actually write it for them. When they ask questions, give direct answers. Be helpful, creative, and engaging."
    
    // Build context from recent conversation
    const recentMessages = messages.slice(-3).map(msg => 
      `${msg.type === 'user' ? 'User' : 'AI'}: ${msg.content}`
    ).join('\n')
    
    // Create a more direct prompt
    let fullPrompt = text
    if (recentMessages) {
      fullPrompt = `Context from recent conversation:\n${recentMessages}\n\nCurrent question: ${text}`
    }

    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'chat',
          prompt: fullPrompt,
          context: recentMessages,
          systemMessage: systemMessage
        })
      })

      const data = await response.json()

      let aiResponse = 'I apologize, but I encountered an error processing your request. Please try again.'
      
      if (data.success && data.data && data.data.content) {
        aiResponse = data.data.content
      } else if (data.success && data.content) {
        // Fallback for different response structure
        aiResponse = data.content
      } else {
        console.error('API Response Error:', data)
        aiResponse = `I encountered an error: ${data.error?.message || 'Unknown error'}`
      }

      // Add AI response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      }

      const finalMessages = [...updatedMessages, aiMessage]
      setMessages(finalMessages)

      // Update or create session
      const sessionTitle = text.length > 50 ? text.substring(0, 50) + '...' : text
      const session: ChatSession = {
        id: sessionId,
        title: sessionTitle,
        messages: finalMessages,
        createdAt: currentSessionId ? chatSessions.find(s => s.id === sessionId)?.createdAt || new Date() : new Date()
      }

      // Save to backend
      try {
        await fetch('/api/content/chat-sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: sessionTitle,
            messages: finalMessages
          })
        })
      } catch (error) {
        console.error('Error saving chat session:', error)
      }

      setChatSessions(prev => {
        const filtered = prev.filter(s => s.id !== sessionId)
        return [session, ...filtered]
      })

    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `I apologize, but I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`,
        timestamp: new Date()
      }
      setMessages([...updatedMessages, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const startNewChat = () => {
    setMessages([])
    setCurrentSessionId(null)
  }

  const loadSession = (sessionId: string) => {
    const session = chatSessions.find(s => s.id === sessionId)
    if (session) {
      setMessages(session.messages)
      setCurrentSessionId(sessionId)
    }
  }

  const deleteSession = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/content/chat-sessions?id=${sessionId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (response.ok) {
        setChatSessions(prev => prev.filter(s => s.id !== sessionId))
        if (currentSessionId === sessionId) {
          startNewChat()
        }
      } else {
        console.error('Failed to delete chat session:', response.status)
        // Fallback to local deletion
        setChatSessions(prev => prev.filter(s => s.id !== sessionId))
        if (currentSessionId === sessionId) {
          startNewChat()
        }
      }
    } catch (error) {
      console.error('Error deleting chat session:', error)
      // Fallback to local deletion
      setChatSessions(prev => prev.filter(s => s.id !== sessionId))
      if (currentSessionId === sessionId) {
        startNewChat()
      }
    }
  }

  const copyMessage = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const exportChat = () => {
    const currentSession = chatSessions.find(s => s.id === currentSessionId)
    if (currentSession) {
      const chatText = currentSession.messages
        .map(msg => `${msg.type === 'user' ? 'You' : 'AI'}: ${msg.content}`)
        .join('\n\n')
      
      const dataBlob = new Blob([chatText], { type: 'text/plain' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `chat-${currentSession.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`
      link.click()
    }
  }

  const handleQuickPrompt = (prompt: string) => {
    setCurrentMessage(prompt)
  }

  const refreshChatSessions = async () => {
    try {
      const response = await fetch('/api/content/chat-sessions', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.data) {
          const sessions = data.data.map((session: any) => ({
            ...session,
            messages: JSON.parse(session.messages).map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp)
            })),
            createdAt: new Date(session.createdAt)
          }))
          setChatSessions(sessions)
        }
      } else {
        console.error('Failed to refresh chat sessions:', response.status)
      }
    } catch (error) {
      console.error('Error refreshing chat sessions:', error)
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gradient">AI Writing Assistant</h1>
            <p className="text-neutral-600 mt-2">Your personal AI writing companion for all creative needs</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Chat Area */}
        <div className="lg:col-span-3">
          <div className="card h-[600px] flex flex-col">
            {/* Chat Header */}
            <div className="flex justify-between items-center p-4 border-b border-neutral-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-800">Writing Assistant</h3>
                  <p className="text-sm text-neutral-500">Always here to help with your writing</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={startNewChat}
                  className="btn-secondary text-sm px-3 py-2 hover:scale-105 active:scale-95 transition-transform"
                >
                  New Chat
                </button>
                {currentSessionId && (
                  <button
                    onClick={exportChat}
                    className="btn-secondary text-sm px-3 py-2 hover:scale-105 active:scale-95 transition-transform"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <Bot className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-neutral-600 mb-2">Start a conversation</h3>
                  <p className="text-neutral-500 mb-6">Ask me anything about writing, storytelling, or creative assistance!</p>
                  
                  {/* Quick Prompts */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                    {QUICK_PROMPTS.map((prompt, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickPrompt(prompt.prompt)}
                        className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 hover:border-indigo-300 hover:bg-indigo-50 hover:scale-102 active:scale-98 transition-all text-left"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <prompt.icon className="w-4 h-4 text-indigo-600" />
                          <span className="font-medium text-sm text-neutral-700">{prompt.text}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((message) => (
                    <MessageBubble key={message.id} message={message} onCopy={copyMessage} />
                  ))}
                  {isTyping && (
                    <div className="flex items-center gap-2 text-neutral-500">
                      <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-sm">AI is typing...</span>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-neutral-200">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  className="input flex-1"
                  placeholder="Ask me anything about writing..."
                  disabled={isTyping}
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={isTyping || !currentMessage.trim()}
                  className="btn-primary px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-transform"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-neutral-800 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-green-500" />
                Chat History ({chatSessions.length})
              </h3>
              <button
                onClick={refreshChatSessions}
                className="p-2 text-neutral-500 hover:text-indigo-600 hover:scale-105 active:scale-95 transition-all"
                title="Refresh chat history"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {chatSessions.length > 0 ? (
              <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
                {chatSessions.map((session) => (
                  <div
                    key={session.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      currentSessionId === session.id
                        ? 'bg-indigo-50 border-indigo-200'
                        : 'bg-neutral-50 border-neutral-200 hover:border-neutral-300'
                    }`}
                    onClick={() => loadSession(session.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm text-neutral-800 line-clamp-2">
                          {session.title}
                        </h4>
                        <p className="text-xs text-neutral-500 mt-1">
                          {session.messages.length} messages
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteSession(session.id)
                        }}
                        className="p-1 text-neutral-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                <p className="text-neutral-500 text-sm">No chat history yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function MessageBubble({ 
  message, 
  onCopy 
}: { 
  message: Message
  onCopy: (content: string) => void
}) {
  const isUser = message.type === 'user'

  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}>
      {!isUser && (
        <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <Bot className="w-4 h-4 text-white" />
        </div>
      )}
      
      <div className={`max-w-[70%] ${isUser ? 'order-first' : ''}`}>
        <div
          className={`p-3 rounded-lg ${
            isUser
              ? 'bg-indigo-600 text-white'
              : 'bg-neutral-100 text-neutral-800'
          }`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <MarkdownRenderer content={message.content} />
          )}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-neutral-500">
            {message.timestamp.toLocaleTimeString()}
          </span>
          {!isUser && (
            <button
              onClick={() => onCopy(message.content)}
              className="p-1 text-neutral-400 hover:text-neutral-600 hover:scale-110 active:scale-90 transition-all"
              title="Copy message"
            >
              <Copy className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {isUser && (
        <div className="w-8 h-8 bg-neutral-200 rounded-lg flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 text-neutral-600" />
        </div>
      )}
    </div>
  )
}

