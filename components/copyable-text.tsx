'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CopyableTextProps {
  text: string
  children: React.ReactNode
  className?: string
}

export function CopyableText({ text, children, className }: CopyableTextProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className={`flex items-center justify-between group ${className || ''}`}>
      <div className="flex-1">
        {children}
      </div>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={handleCopy}
        className="ml-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0"
        title={copied ? "Copied!" : "Copy URL"}
      >
        {copied ? (
          <Check className="h-3 w-3 text-green-500" />
        ) : (
          <Copy className="h-3 w-3 text-gray-500" />
        )}
      </Button>
    </div>
  )
} 