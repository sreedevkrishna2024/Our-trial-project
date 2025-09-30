'use client'

import { 
  Download, 
  FileText, 
  File, 
  Archive,
  Settings,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { useState } from 'react'

interface ExportTabProps {
  className?: string
}

export default function ExportTab({ className = '' }: ExportTabProps) {
  const [selectedFormat, setSelectedFormat] = useState('pdf')
  const [includeMetadata, setIncludeMetadata] = useState(true)
  const [exportProgress, setExportProgress] = useState(0)
  const [isExporting, setIsExporting] = useState(false)

  const exportFormats = [
    {
      id: 'pdf',
      name: 'PDF Document',
      description: 'Professional PDF with formatting',
      icon: FileText,
      color: 'text-red-500'
    },
    {
      id: 'docx',
      name: 'Word Document',
      description: 'Editable .docx format',
      icon: File,
      color: 'text-blue-500'
    },
    {
      id: 'txt',
      name: 'Plain Text',
      description: 'Simple text file',
      icon: FileText,
      color: 'text-gray-500'
    },
    {
      id: 'epub',
      name: 'EPUB',
      description: 'E-book format',
      icon: Book,
      color: 'text-purple-500'
    }
  ]

  const exportOptions = [
    {
      id: 'all-stories',
      name: 'All Stories',
      description: 'Export all your stories',
      count: 12,
      size: '2.3 MB'
    },
    {
      id: 'selected-stories',
      name: 'Selected Stories',
      description: 'Export only selected stories',
      count: 3,
      size: '856 KB'
    },
    {
      id: 'characters',
      name: 'Character Profiles',
      description: 'Export all character profiles',
      count: 8,
      size: '445 KB'
    },
    {
      id: 'worlds',
      name: 'World Building',
      description: 'Export world building content',
      count: 5,
      size: '1.2 MB'
    }
  ]

  const handleExport = async (optionId: string) => {
    setIsExporting(true)
    setExportProgress(0)
    
    // Simulate export progress
    const interval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsExporting(false)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Export Format Selection */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Download className="w-5 h-5 text-blue-500" />
          Export Format
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {exportFormats.map((format) => (
            <div
              key={format.id}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedFormat === format.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedFormat(format.id)}
            >
              <div className="flex items-center gap-3 mb-2">
                <format.icon className={`w-5 h-5 ${format.color}`} />
                <h4 className="font-medium text-gray-900">{format.name}</h4>
              </div>
              <p className="text-sm text-gray-600">{format.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">What to Export</h3>
        <div className="space-y-4">
          {exportOptions.map((option) => (
            <div key={option.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-4">
                <input
                  type="radio"
                  name="export-option"
                  id={option.id}
                  className="w-4 h-4 text-blue-600"
                />
                <div>
                  <h4 className="font-medium text-gray-900">{option.name}</h4>
                  <p className="text-sm text-gray-600">{option.description}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{option.count} items</p>
                <p className="text-xs text-gray-500">{option.size}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Export Settings */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5 text-gray-500" />
          Export Settings
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Include Metadata</h4>
              <p className="text-sm text-gray-600">Include creation date, word count, and other details</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={includeMetadata}
                onChange={(e) => setIncludeMetadata(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Export Progress */}
      {isExporting && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Exporting...</h3>
          <div className="space-y-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${exportProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600">Preparing your export... {exportProgress}%</p>
          </div>
        </div>
      )}

      {/* Export Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Ready to Export</h3>
            <p className="text-sm text-gray-600">Your content will be prepared for download</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => handleExport('all-stories')}
              disabled={isExporting}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              Export Now
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              <Archive className="w-4 h-4" />
              Save as Template
            </button>
          </div>
        </div>
      </div>

      {/* Export History */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Exports</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-red-500" />
              <div>
                <p className="font-medium text-gray-900">All Stories - PDF</p>
                <p className="text-sm text-gray-600">Exported 2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm text-gray-600">2.3 MB</span>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <File className="w-5 h-5 text-blue-500" />
              <div>
                <p className="font-medium text-gray-900">Character Profiles - DOCX</p>
                <p className="text-sm text-gray-600">Exported 1 day ago</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm text-gray-600">445 KB</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}