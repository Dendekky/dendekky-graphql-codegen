'use client'

import { Button } from '@/components/ui/button'
import { Globe, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

interface InputModeToggleProps {
  mode: 'endpoint' | 'schema'
  onChange: (mode: 'endpoint' | 'schema') => void
  className?: string
}

export function InputModeToggle({ mode, onChange, className }: InputModeToggleProps) {
  return (
    <div className={cn("flex p-1 bg-gray-100 dark:bg-gray-800 rounded-lg", className)}>
      <Button
        type="button"
        variant={mode === 'endpoint' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onChange('endpoint')}
        className={cn(
          "flex-1 flex items-center gap-2 transition-all duration-200",
          mode === 'endpoint'
            ? "bg-white dark:bg-gray-700 shadow-sm"
            : "hover:bg-gray-200 dark:hover:bg-gray-700"
        )}
      >
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">Endpoint URL</span>
        <span className="sm:hidden">URL</span>
      </Button>
      
      <Button
        type="button"
        variant={mode === 'schema' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onChange('schema')}
        className={cn(
          "flex-1 flex items-center gap-2 transition-all duration-200",
          mode === 'schema'
            ? "bg-white dark:bg-gray-700 shadow-sm"
            : "hover:bg-gray-200 dark:hover:bg-gray-700"
        )}
      >
        <FileText className="h-4 w-4" />
        <span className="hidden sm:inline">Schema Definition</span>
        <span className="sm:hidden">Schema</span>
      </Button>
    </div>
  )
} 