'use client'

import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { FileText, AlertCircle } from 'lucide-react'

interface SchemaInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function SchemaInput({ 
  value, 
  onChange, 
  placeholder = "Paste your GraphQL schema definition here...",
  className = ""
}: SchemaInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
  }

  const lineCount = value.split('\n').length

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileText className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            GraphQL Schema Definition
          </span>
        </div>
        <div className="flex items-center space-x-2">
          {value && (
            <Badge variant="outline" className="text-xs">
              {lineCount} lines
            </Badge>
          )}
          <Badge variant="outline" className="text-xs">
            SDL Format
          </Badge>
        </div>
      </div>
      
      <div className="relative">
        <Textarea
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={`font-mono text-sm min-h-[200px] resize-y border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl shadow-sm transition-all duration-200 ${className}`}
        />
        
        {!value && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center text-gray-400 dark:text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Paste your GraphQL schema here</p>
              <p className="text-xs mt-1">Schema Definition Language (SDL) format</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex items-start space-x-2 text-xs text-gray-500 dark:text-gray-400">
        <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
        <p>
          Expected format: GraphQL Schema Definition Language (SDL). 
          Example: <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">type Query {`{`} hello: String {`}`}</code>
        </p>
      </div>
    </div>
  )
} 