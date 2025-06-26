'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Circle, Code2, FileText, Server, Zap, Layers, Settings } from 'lucide-react'

export interface OutputFormat {
  id: string
  name: string
  description: string
  category: 'core' | 'client' | 'server' | 'advanced'
  plugins: string[]
  icon: React.ComponentType<{ className?: string }>
  popular?: boolean
  requiresDocuments?: boolean
  config?: Record<string, any>
}

export const OUTPUT_FORMATS: OutputFormat[] = [
  // Core Types
  {
    id: 'typescript',
    name: 'TypeScript Types',
    description: 'Basic TypeScript types from your GraphQL schema',
    category: 'core',
    plugins: ['typescript'],
    icon: Code2,
    popular: true,
    config: {}
  },
  {
    id: 'typescript-operations',
    name: 'TypeScript Operations',
    description: 'Types for your GraphQL operations (queries, mutations, subscriptions)',
    category: 'core',
    plugins: ['typescript', 'typescript-operations'],
    icon: FileText,
    requiresDocuments: true,
    config: {}
  },

  // Client-side
  {
    id: 'typescript-graphql-request',
    name: 'GraphQL Request SDK',
    description: 'Ready-to-use SDK for graphql-request with full typing',
    category: 'client',
    plugins: ['typescript', 'typescript-operations', 'typescript-graphql-request'],
    icon: Zap,
    popular: true,
    requiresDocuments: true,
    config: {}
  },
  {
    id: 'typed-document-node',
    name: 'Typed Document Node',
    description: 'Pre-compiled DocumentNode with TypeScript types for any GraphQL client',
    category: 'client',
    plugins: ['typescript', 'typescript-operations', 'typed-document-node'],
    icon: Layers,
    requiresDocuments: true,
    config: {}
  },
  {
    id: 'typescript-react-query',
    name: 'React Query Hooks',
    description: 'React Query/TanStack Query hooks with TypeScript support',
    category: 'client',
    plugins: ['typescript', 'typescript-operations', 'typescript-react-query'],
    icon: Zap,
    requiresDocuments: true,
    config: {
      fetcher: 'fetch',
      legacyMode: false
    }
  },

  // Server-side
  {
    id: 'typescript-resolvers',
    name: 'TypeScript Resolvers',
    description: 'Type-safe resolver signatures for GraphQL servers',
    category: 'server',
    plugins: ['typescript', 'typescript-resolvers'],
    icon: Server,
    config: {
      useIndexSignature: true
    }
  },

  // Advanced
  {
    id: 'custom',
    name: 'Custom Configuration',
    description: 'Advanced: Define your own plugin combination and configuration',
    category: 'advanced',
    plugins: [],
    icon: Settings,
    config: {}
  }
]

interface OutputFormatSelectorProps {
  selectedFormats: string[]
  onChange: (formats: string[]) => void
}

export function OutputFormatSelector({ selectedFormats, onChange }: OutputFormatSelectorProps) {
  const [activeCategory, setActiveCategory] = useState<string>('core')

  const categories = [
    { id: 'core', name: 'Core Types', icon: Code2, color: 'blue' },
    { id: 'client', name: 'Client SDKs', icon: Zap, color: 'green' },
    { id: 'server', name: 'Server Tools', icon: Server, color: 'purple' },
    { id: 'advanced', name: 'Advanced', icon: Settings, color: 'orange' }
  ]

  const filteredFormats = OUTPUT_FORMATS.filter(format => format.category === activeCategory)

  const toggleFormat = (formatId: string) => {
    if (selectedFormats.includes(formatId)) {
      onChange(selectedFormats.filter(id => id !== formatId))
    } else {
      onChange([...selectedFormats, formatId])
    }
  }

  const getCategoryColor = (color: string) => {
    const colors = {
      blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      green: 'text-green-400 bg-green-500/10 border-green-500/20',
      purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      orange: 'text-orange-400 bg-orange-500/10 border-orange-500/20'
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  return (
    <Card className="border border-white/20 bg-white/5 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <FileText className="h-5 w-5 text-purple-400" />
          Output Formats
          {selectedFormats.length > 0 && (
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
              {selectedFormats.length} selected
            </Badge>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const Icon = category.icon
            const isActive = activeCategory === category.id
            return (
              <Button
                key={category.id}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(category.id)}
                className={`${
                  isActive 
                    ? `${getCategoryColor(category.color)} border` 
                    : 'bg-white/5 border-white/20 hover:bg-white/10'
                } transition-all duration-200`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {category.name}
              </Button>
            )
          })}
        </div>

        {/* Format Options */}
        <div className="space-y-3">
          {filteredFormats.map((format) => {
            const Icon = format.icon
            const isSelected = selectedFormats.includes(format.id)
            
            return (
              <div
                key={format.id}
                className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer group ${
                  isSelected
                    ? 'bg-blue-500/10 border-blue-500/30 ring-1 ring-blue-500/20'
                    : 'bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30'
                }`}
                onClick={() => toggleFormat(format.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {isSelected ? (
                      <CheckCircle className="h-5 w-5 text-blue-400" />
                    ) : (
                      <Circle className="h-5 w-5 text-gray-400 group-hover:text-gray-300" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className={`h-5 w-5 ${isSelected ? 'text-blue-400' : 'text-gray-400'}`} />
                      <h3 className={`font-semibold ${isSelected ? 'text-blue-300' : 'text-gray-200'}`}>
                        {format.name}
                      </h3>
                      {format.popular && (
                        <Badge variant="secondary" className="bg-green-500/20 text-green-400 text-xs">
                          Popular
                        </Badge>
                      )}
                      {format.requiresDocuments && (
                        <Badge variant="outline" className="border-orange-500/30 text-orange-400 text-xs">
                          Requires GraphQL Operations
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 mb-2">
                      {format.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {format.plugins.map((plugin) => (
                        <Badge
                          key={plugin}
                          variant="outline"
                          className="text-xs bg-gray-800/50 border-gray-600/30 text-gray-300"
                        >
                          {plugin}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Help Text */}
        <div className="text-xs text-gray-500 space-y-1 p-3 bg-white/5 rounded-lg border border-white/10">
          <p className="font-medium text-gray-400">💡 Output Format Guide:</p>
          <p>• <span className="text-blue-400">Core Types</span> - Essential TypeScript types from your schema</p>
          <p>• <span className="text-green-400">Client SDKs</span> - Ready-to-use client libraries and hooks</p>
          <p>• <span className="text-purple-400">Server Tools</span> - Type-safe resolver signatures for GraphQL servers</p>
          <p>• <span className="text-orange-400">Advanced</span> - Custom configurations for specialized use cases</p>
        </div>
      </CardContent>
    </Card>
  )
} 