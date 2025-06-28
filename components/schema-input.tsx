'use client'

import { useEffect, useRef } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { FileText, AlertCircle, CheckCircle, Loader2, AlertTriangle } from 'lucide-react'
import { useCodegenStore } from '@/lib/store'
import { createDebouncedValidator } from '@/lib/schema-validation'

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
  const { schemaValidation, setSchemaValidation, setSchemaValidating } = useCodegenStore()
  const debouncedValidatorRef = useRef<((schemaText: string) => void) | null>(null)

  // Initialize debounced validator
  useEffect(() => {
    debouncedValidatorRef.current = createDebouncedValidator((result) => {
      setSchemaValidation({
        isValid: result.isValid,
        errors: result.errors,
        isValidating: false,
      })
    }, 300) // 300ms delay for responsiveness
  }, [setSchemaValidation])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    onChange(newValue)

    // Start validation
    if (newValue.trim()) {
      setSchemaValidating(true)
      debouncedValidatorRef.current?.(newValue)
    } else {
      // Clear validation for empty input
      setSchemaValidation({
        isValid: true,
        errors: [],
        isValidating: false,
      })
    }
  }

  const lineCount = value.split('\n').length
  const hasErrors = !schemaValidation.isValid && schemaValidation.errors.length > 0
  const hasValue = value.trim().length > 0

  // Get validation status
  const getValidationStatus = () => {
    if (!hasValue) return 'neutral'
    if (schemaValidation.isValidating) return 'validating'
    if (hasErrors) return 'error'
    return 'valid'
  }

  const validationStatus = getValidationStatus()

  // Get border color based on validation state
  const getBorderClass = () => {
    switch (validationStatus) {
      case 'error':
        return 'border-red-500 dark:border-red-400 focus:border-red-500 dark:focus:border-red-400'
      case 'valid':
        return 'border-green-500 dark:border-green-400 focus:border-green-500 dark:focus:border-green-400'
      case 'validating':
        return 'border-yellow-500 dark:border-yellow-400 focus:border-yellow-500 dark:focus:border-yellow-400'
      default:
        return 'border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400'
    }
  }

  // Get status icon
  const getStatusIcon = () => {
    switch (validationStatus) {
      case 'validating':
        return <Loader2 className="h-4 w-4 text-yellow-500 animate-spin" />
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 'valid':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <FileText className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            GraphQL Schema Definition
          </span>
          {validationStatus === 'validating' && (
            <span className="text-xs text-yellow-600 dark:text-yellow-400">
              Validating...
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {value && (
            <Badge variant="outline" className="text-xs">
              {lineCount} lines
            </Badge>
          )}
          {validationStatus === 'valid' && hasValue && (
            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200 dark:bg-green-950/50 dark:text-green-400 dark:border-green-800">
              Valid Schema
            </Badge>
          )}
          {validationStatus === 'error' && (
            <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200 dark:bg-red-950/50 dark:text-red-400 dark:border-red-800">
              {schemaValidation.errors.length} Error{schemaValidation.errors.length !== 1 ? 's' : ''}
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
          className={`font-mono text-sm min-h-[200px] resize-y border-2 ${getBorderClass()} rounded-xl shadow-sm transition-all duration-200 ${className}`}
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

      {/* Validation Errors */}
      {hasErrors && (
        <div className="space-y-2">
          {schemaValidation.errors.map((error, index) => (
            <div
              key={index}
              className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-lg"
            >
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-red-800 dark:text-red-200">
                    {error.location && (
                      <span className="font-mono text-xs bg-red-100 dark:bg-red-900/50 px-1.5 py-0.5 rounded mr-2">
                        {error.location}
                      </span>
                    )}
                    Schema Validation Error
                  </p>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                    {error.message}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Help Text */}
      <div className="flex items-start space-x-2 text-xs text-gray-500 dark:text-gray-400">
        <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
        <p>
          Expected format: GraphQL Schema Definition Language (SDL). 
          Example: <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">type Query {`{`} hello: String {`}`}</code>
          {hasValue && validationStatus === 'valid' && (
            <span className="text-green-600 dark:text-green-400 ml-2">✓ Schema is valid and ready to generate types!</span>
          )}
        </p>
      </div>
    </div>
  )
} 