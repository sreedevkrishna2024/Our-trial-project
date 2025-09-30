'use client'

import { useState } from 'react'
import { Copy, RefreshCw, Download, Share2, Heart, Bookmark } from 'lucide-react'

interface ResultsDisplayProps {
  results: string[]
  onRegenerate?: () => void
  type?: string
  className?: string
}

export function ResultsDisplay({ 
  results, 
  onRegenerate, 
  type = 'content',
  className = '' 
}: ResultsDisplayProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const downloadAsText = (text: string, index: number) => {
    const element = document.createElement('a')
    const file = new Blob([text], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = `${type}_${index + 1}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  if (!results || results.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-gray-500">No results to display</p>
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {results.map((result, index) => (
        <div
          key={index}
          className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {type.charAt(0).toUpperCase() + type.slice(1)} #{index + 1}
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => copyToClipboard(result, index)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Copy to clipboard"
              >
                <Copy className="w-4 h-4" />
                {copiedIndex === index && (
                  <span className="text-xs text-green-600 ml-1">Copied!</span>
                )}
              </button>
              <button
                onClick={() => downloadAsText(result, index)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Download as text"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Share"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                title="Like"
              >
                <Heart className="w-4 h-4" />
              </button>
              <button
                className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                title="Bookmark"
              >
                <Bookmark className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="prose prose-sm max-w-none">
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
              {result}
            </div>
          </div>
        </div>
      ))}
      
      {onRegenerate && (
        <div className="flex justify-center pt-4">
          <button
            onClick={onRegenerate}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Regenerate
          </button>
        </div>
      )}
    </div>
  )
}