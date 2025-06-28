'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface CopyableCodeProps {
  code: string
  className?: string
  children?: React.ReactNode
}

export function CopyableCode({ code, className, children }: CopyableCodeProps) {
  const [copied, setCopied] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 500)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div
      className={cn("relative group", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      
      {/* Copy Button - Shows on hover */}
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={handleCopy}
        className={cn(
          "absolute top-2 right-2 h-8 w-8 p-0 transition-all duration-200",
          "bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm",
          "border border-gray-300 dark:border-gray-600",
          "hover:bg-gray-50 dark:hover:bg-gray-800",
          isHovered || copied ? "opacity-100 scale-100" : "opacity-0 scale-95"
        )}
        title={copied ? "Copied!" : "Copy to clipboard"}
      >
        {copied ? (
          <Check className="h-3 w-3 text-green-500" />
        ) : (
          <Copy className="h-3 w-3 text-gray-600 dark:text-gray-400" />
        )}
      </Button>
      
      {/* Copied feedback */}
      {copied && (
        <div className="absolute top-12 right-2 px-2 py-1 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 text-xs rounded-md animate-in fade-in-0 zoom-in-95 duration-200">
          Copied!
        </div>
      )}
    </div>
  )
} 