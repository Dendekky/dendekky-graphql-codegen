'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, X, ChevronDown, ChevronRight, Key, Globe } from 'lucide-react'

interface Header {
  id: string
  key: string
  value: string
}

interface HeadersInputProps {
  headers: Record<string, string>
  onChange: (headers: Record<string, string>) => void
}

const COMMON_HEADERS = [
  { key: 'Authorization', value: 'Bearer YOUR_TOKEN', description: 'API token authentication' },
  { key: 'X-API-Key', value: 'YOUR_API_KEY', description: 'API key header' },
  { key: 'Content-Type', value: 'application/json', description: 'Request content type' },
  { key: 'User-Agent', value: 'GraphQL-Codegen-Web/1.0', description: 'Custom user agent' },
]

export function HeadersInput({ headers, onChange }: HeadersInputProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [headerList, setHeaderList] = useState<Header[]>(() => {
    return Object.entries(headers).map(([key, value], index) => ({
      id: `header-${index}`,
      key,
      value
    }))
  })

  const addHeader = (key = '', value = '') => {
    const newHeader: Header = {
      id: `header-${Date.now()}`,
      key,
      value
    }
    const newList = [...headerList, newHeader]
    setHeaderList(newList)
    updateHeaders(newList)
  }

  const removeHeader = (id: string) => {
    const newList = headerList.filter(h => h.id !== id)
    setHeaderList(newList)
    updateHeaders(newList)
  }

  const updateHeader = (id: string, field: 'key' | 'value', newValue: string) => {
    const newList = headerList.map(h => 
      h.id === id ? { ...h, [field]: newValue } : h
    )
    setHeaderList(newList)
    updateHeaders(newList)
  }

  const updateHeaders = (list: Header[]) => {
    const headersObject = list.reduce((acc, header) => {
      if (header.key.trim() && header.value.trim()) {
        acc[header.key.trim()] = header.value.trim()
      }
      return acc
    }, {} as Record<string, string>)
    onChange(headersObject)
  }

  const addCommonHeader = (commonHeader: typeof COMMON_HEADERS[0]) => {
    addHeader(commonHeader.key, commonHeader.value)
    setIsExpanded(true)
  }

  const hasHeaders = headerList.length > 0
  const validHeaderCount = headerList.filter(h => h.key.trim() && h.value.trim()).length

  return (
    <Card className="border border-white/20 bg-white/5 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader 
        className="cursor-pointer select-none hover:bg-white/5 transition-colors duration-200 rounded-t-lg"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <CardTitle className="flex items-center justify-between text-sm font-medium">
          <div className="flex items-center gap-2">
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-blue-400" />
            ) : (
              <ChevronRight className="h-4 w-4 text-blue-400" />
            )}
            <Key className="h-4 w-4 text-emerald-400" />
            <span>Custom Headers</span>
            {validHeaderCount > 0 && (
              <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full">
                {validHeaderCount}
              </span>
            )}
          </div>
          <Globe className="h-4 w-4 text-gray-400" />
        </CardTitle>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-4">
          {/* Common Headers Quick Add */}
          <div className="space-y-2">
            <p className="text-xs text-gray-400 font-medium">Quick Add:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {COMMON_HEADERS.map((header) => (
                <Button
                  key={header.key}
                  variant="outline"
                  size="sm"
                  onClick={() => addCommonHeader(header)}
                  className="justify-start text-xs h-auto py-2 px-3 bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30"
                >
                  <span className="font-medium text-blue-400">{header.key}</span>
                  <span className="text-gray-500 ml-1 truncate">{header.description}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Headers List */}
          {hasHeaders && (
            <div className="space-y-3">
              <p className="text-xs text-gray-400 font-medium">Custom Headers:</p>
              {headerList.map((header) => (
                <div key={header.id} className="flex gap-2 items-center group">
                  <Input
                    placeholder="Header name (e.g., X-API-Key)"
                    value={header.key}
                    onChange={(e) => updateHeader(header.id, 'key', e.target.value)}
                    className="flex-1 bg-white/5 border-white/20 focus:border-blue-400/50"
                  />
                  <Input
                    placeholder="Header value"
                    value={header.value}
                    onChange={(e) => updateHeader(header.id, 'value', e.target.value)}
                    className="flex-1 bg-white/5 border-white/20 focus:border-blue-400/50"
                    type={header.key.toLowerCase().includes('auth') ? 'password' : 'text'}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeHeader(header.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Add Custom Header Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => addHeader()}
            className="w-full bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Custom Header
          </Button>

          {/* Help Text */}
          <div className="text-xs text-gray-500 space-y-1 mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
            <p className="font-medium text-gray-400">💡 Common use cases:</p>
            <p>• <span className="font-mono text-blue-400">Authorization: Bearer token123</span> - For JWT tokens</p>
            <p>• <span className="font-mono text-emerald-400">X-API-Key: your-key</span> - For API key authentication</p>
            <p>• <span className="font-mono text-purple-400">X-Custom-Header: value</span> - Any custom headers</p>
            <p className="text-xs text-gray-600 mt-2 font-medium">🌐 Try with APIs like GitHub GraphQL, Shopify, or Hasura that require authentication headers</p>
          </div>
        </CardContent>
      )}
    </Card>
  )
} 