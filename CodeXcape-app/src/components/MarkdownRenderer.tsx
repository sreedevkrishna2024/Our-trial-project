'use client'

import React from 'react'

interface MarkdownRendererProps {
  content: string
  className?: string
}

export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  // Simple markdown parser for basic formatting
  const parseMarkdown = (text: string): React.ReactNode[] => {
    const lines = text.split('\n')
    const elements: React.ReactNode[] = []
    let key = 0

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      
      if (line.trim() === '') {
        elements.push(<br key={key++} />)
        continue
      }

      // Headers
      if (line.startsWith('### ')) {
        elements.push(
          <h3 key={key++} className="text-lg font-bold text-slate-900 mt-4 mb-2">
            {line.substring(4)}
          </h3>
        )
      } else if (line.startsWith('## ')) {
        elements.push(
          <h2 key={key++} className="text-xl font-bold text-slate-900 mt-6 mb-3">
            {line.substring(3)}
          </h2>
        )
      } else if (line.startsWith('# ')) {
        elements.push(
          <h1 key={key++} className="text-2xl font-bold text-slate-900 mt-8 mb-4">
            {line.substring(2)}
          </h1>
        )
      }
      // Lists
      else if (line.startsWith('- ') || line.startsWith('* ')) {
        elements.push(
          <li key={key++} className="ml-4 text-slate-700">
            {line.substring(2)}
          </li>
        )
      } else if (/^\d+\.\s/.test(line)) {
        elements.push(
          <li key={key++} className="ml-4 text-slate-700">
            {line.replace(/^\d+\.\s/, '')}
          </li>
        )
      }
      // Code blocks
      else if (line.startsWith('```')) {
        const codeLines: string[] = []
        i++ // Skip the opening ```
        while (i < lines.length && !lines[i].startsWith('```')) {
          codeLines.push(lines[i])
          i++
        }
        elements.push(
          <pre key={key++} className="bg-slate-100 p-4 rounded-lg overflow-x-auto my-4">
            <code className="text-sm text-slate-800">
              {codeLines.join('\n')}
            </code>
          </pre>
        )
      }
      // Regular paragraphs
      else {
        const processedLine = processInlineMarkdown(line)
        elements.push(
          <p key={key++} className="text-slate-700 mb-3 leading-relaxed">
            {processedLine}
          </p>
        )
      }
    }

    return elements
  }

  // Process inline markdown (bold, italic, code)
  const processInlineMarkdown = (text: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = []
    let currentIndex = 0
    let key = 0

    // Bold text **text**
    const boldRegex = /\*\*(.*?)\*\*/g
    let match
    while ((match = boldRegex.exec(text)) !== null) {
      // Add text before the match
      if (match.index > currentIndex) {
        parts.push(text.substring(currentIndex, match.index))
      }
      // Add bold text
      parts.push(
        <strong key={key++} className="font-bold text-slate-900">
          {match[1]}
        </strong>
      )
      currentIndex = match.index + match[0].length
    }

    // Italic text *text*
    const italicRegex = /\*(.*?)\*/g
    currentIndex = 0
    const newParts: React.ReactNode[] = []
    
    for (const part of parts) {
      if (typeof part === 'string') {
        while ((match = italicRegex.exec(part)) !== null) {
          // Add text before the match
          if (match.index > currentIndex) {
            newParts.push(part.substring(currentIndex, match.index))
          }
          // Add italic text
          newParts.push(
            <em key={key++} className="italic text-slate-600">
              {match[1]}
            </em>
          )
          currentIndex = match.index + match[0].length
        }
        // Add remaining text
        if (currentIndex < part.length) {
          newParts.push(part.substring(currentIndex))
        }
        currentIndex = 0
      } else {
        newParts.push(part)
      }
    }

    // Inline code `code`
    const codeRegex = /`(.*?)`/g
    const finalParts: React.ReactNode[] = []
    currentIndex = 0

    for (const part of newParts) {
      if (typeof part === 'string') {
        while ((match = codeRegex.exec(part)) !== null) {
          // Add text before the match
          if (match.index > currentIndex) {
            finalParts.push(part.substring(currentIndex, match.index))
          }
          // Add code text
          finalParts.push(
            <code key={key++} className="bg-slate-100 px-2 py-1 rounded text-sm text-slate-800 font-mono">
              {match[1]}
            </code>
          )
          currentIndex = match.index + match[0].length
        }
        // Add remaining text
        if (currentIndex < part.length) {
          finalParts.push(part.substring(currentIndex))
        }
        currentIndex = 0
      } else {
        finalParts.push(part)
      }
    }

    // Add remaining text
    if (currentIndex < text.length) {
      finalParts.push(text.substring(currentIndex))
    }

    return finalParts.length > 0 ? finalParts : [text]
  }

  return (
    <div className={`markdown-content ${className}`}>
      {parseMarkdown(content)}
    </div>
  )
}


