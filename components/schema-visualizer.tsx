'use client'

import { useState, useMemo } from 'react'
import { 
  ChevronRight, 
  ChevronDown, 
  Database, 
  GitBranch, 
  Hash, 
  Type, 
  FileInput, 
  Link,
  Search,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  Info,
  AlertTriangle
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ParsedSchema, SchemaTypeInfo } from '@/lib/schema-parser'

interface SchemaVisualizerProps {
  schema: ParsedSchema
  onTypeSelect?: (typeName: string) => void
}

export function SchemaVisualizer({ schema, onTypeSelect }: SchemaVisualizerProps) {
  const [expandedTypes, setExpandedTypes] = useState<Set<string>>(new Set())
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showBuiltIns, setShowBuiltIns] = useState(false)

  // Filter types based on search and built-in toggle
  const filteredTypes = useMemo(() => {
    return schema.types.filter(type => {
      if (!showBuiltIns && type.isBuiltIn) return false
      if (!searchQuery) return true
      return type.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             type.description?.toLowerCase().includes(searchQuery.toLowerCase())
    })
  }, [schema.types, searchQuery, showBuiltIns])

  const toggleTypeExpansion = (typeName: string) => {
    const newExpanded = new Set(expandedTypes)
    if (newExpanded.has(typeName)) {
      newExpanded.delete(typeName)
    } else {
      newExpanded.add(typeName)
    }
    setExpandedTypes(newExpanded)
  }

  const handleTypeClick = (typeName: string) => {
    setSelectedType(typeName)
    onTypeSelect?.(typeName)
  }

  const getTypeIcon = (kind: SchemaTypeInfo['kind']) => {
    switch (kind) {
      case 'OBJECT': return Database
      case 'INTERFACE': return GitBranch
      case 'UNION': return Link
      case 'ENUM': return Hash
      case 'SCALAR': return Type
      case 'INPUT_OBJECT': return FileInput
      default: return Type
    }
  }

  const getTypeColor = (type: SchemaTypeInfo) => {
    if (type.name === schema.queryType) return 'bg-blue-500'
    if (type.name === schema.mutationType) return 'bg-green-500'
    if (type.name === schema.subscriptionType) return 'bg-purple-500'
    
    switch (type.kind) {
      case 'OBJECT': return 'bg-indigo-500'
      case 'INTERFACE': return 'bg-cyan-500'
      case 'UNION': return 'bg-orange-500'
      case 'ENUM': return 'bg-yellow-500'
      case 'SCALAR': return 'bg-gray-500'
      case 'INPUT_OBJECT': return 'bg-pink-500'
      default: return 'bg-gray-500'
    }
  }

  const getRootTypeLabel = (typeName: string) => {
    if (typeName === schema.queryType) return 'Query'
    if (typeName === schema.mutationType) return 'Mutation'
    if (typeName === schema.subscriptionType) return 'Subscription'
    return null
  }

  // Extract base type name from GraphQL type string (e.g., "[Post!]!" -> "Post")
  const extractBaseType = (typeString: string): string => {
    return typeString.replace(/[\[\]!]/g, '')
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>Schema Explorer</span>
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowBuiltIns(!showBuiltIns)}
            className="flex items-center gap-2"
          >
            {showBuiltIns ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showBuiltIns ? 'Hide' : 'Show'} Built-ins
          </Button>
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
          <span>{filteredTypes.length} types</span>
          <span>{schema.relationships.length} relationships</span>
          {schema.queryType && <span>Query: {schema.queryType}</span>}
          {schema.mutationType && <span>Mutation: {schema.mutationType}</span>}
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search types and descriptions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      
      <CardContent className="max-h-96 overflow-y-auto">
        {filteredTypes.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <AlertCircle className="h-8 w-8 mx-auto mb-2" />
            <p>No types found matching your search.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredTypes.map(type => {
              const isExpanded = expandedTypes.has(type.name)
              const isSelected = selectedType === type.name
              const Icon = getTypeIcon(type.kind)
              const rootLabel = getRootTypeLabel(type.name)
              const hasFields = (type.fields && type.fields.length > 0) || 
                               (type.inputFields && type.inputFields.length > 0) ||
                               (type.enumValues && type.enumValues.length > 0) ||
                               (type.possibleTypes && type.possibleTypes.length > 0)

              return (
                <div key={type.name} className="mb-2">
                  <div
                    className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md ${
                      isSelected 
                        ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-300 dark:border-blue-700 shadow-md' 
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750'
                    }`}
                    onClick={() => {
                      handleTypeClick(type.name)
                      if (hasFields) toggleTypeExpansion(type.name)
                    }}
                  >
                    <div className="flex items-center space-x-2 flex-1">
                      {hasFields && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleTypeExpansion(type.name)
                          }}
                          className="p-0.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                        >
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4 text-gray-500" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-gray-500" />
                          )}
                        </button>
                      )}
                      
                      <div className={`p-2 rounded-lg ${getTypeColor(type)}`}>
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {type.name}
                          </span>
                          {rootLabel && (
                            <Badge variant="default" className="text-xs">
                              {rootLabel}
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs">
                            {type.kind.toLowerCase().replace('_', ' ')}
                          </Badge>
                          {type.isBuiltIn && (
                            <Badge variant="secondary" className="text-xs">
                              Built-in
                            </Badge>
                          )}
                        </div>
                        {type.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {type.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {isExpanded && hasFields && (
                    <div className="mt-2 ml-8 space-y-1 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
                      {/* Object/Interface Fields */}
                      {type.fields && type.fields.map(field => (
                        <div key={field.name} className="py-2 border-b border-gray-100 dark:border-gray-800">
                          <div className="flex items-center space-x-2">
                            <ArrowRight className="h-3 w-3 text-gray-400" />
                            <span className="font-medium text-sm text-gray-800 dark:text-gray-200">
                              {field.name}
                            </span>
                            <span className="text-xs text-gray-500">:</span>
                            <button
                              onClick={() => {
                                const baseType = extractBaseType(field.type)
                                if (filteredTypes.some(t => t.name === baseType)) {
                                  handleTypeClick(baseType)
                                }
                              }}
                              className={`text-sm font-mono px-2 py-0.5 rounded transition-colors ${
                                filteredTypes.some(t => t.name === extractBaseType(field.type))
                                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 cursor-pointer'
                                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                              }`}
                            >
                              {field.type}
                            </button>
                            {field.isDeprecated && (
                              <div title={field.deprecationReason || 'Deprecated'}>
                                <AlertTriangle className="h-3 w-3 text-orange-500" />
                              </div>
                            )}
                          </div>
                          {field.description && (
                            <div className="ml-5 mt-1 text-xs text-gray-500 dark:text-gray-400">
                              {field.description}
                            </div>
                          )}
                          {field.args && field.args.length > 0 && (
                            <div className="ml-5 mt-1 space-y-1">
                              <div className="text-xs font-medium text-gray-600 dark:text-gray-400">Arguments:</div>
                              {field.args.map(arg => (
                                <div key={arg.name} className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                                  <span className="font-mono">{arg.name}: {arg.type}</span>
                                  {arg.defaultValue && <span className="text-gray-400"> = {arg.defaultValue}</span>}
                                  {arg.description && <div className="ml-2 text-gray-400">{arg.description}</div>}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}

                      {/* Input Object Fields */}
                      {type.inputFields && type.inputFields.map(field => (
                        <div key={field.name} className="py-2 border-b border-gray-100 dark:border-gray-800">
                          <div className="flex items-center space-x-2">
                            <ArrowRight className="h-3 w-3 text-gray-400" />
                            <span className="font-medium text-sm text-gray-800 dark:text-gray-200">
                              {field.name}
                            </span>
                            <span className="text-xs text-gray-500">:</span>
                            <button
                              onClick={() => {
                                const baseType = extractBaseType(field.type)
                                if (filteredTypes.some(t => t.name === baseType)) {
                                  handleTypeClick(baseType)
                                }
                              }}
                              className={`text-sm font-mono px-2 py-0.5 rounded transition-colors ${
                                filteredTypes.some(t => t.name === extractBaseType(field.type))
                                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 cursor-pointer'
                                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                              }`}
                            >
                              {field.type}
                            </button>
                            {field.defaultValue && (
                              <span className="text-xs text-gray-400">= {field.defaultValue}</span>
                            )}
                          </div>
                          {field.description && (
                            <div className="ml-5 mt-1 text-xs text-gray-500 dark:text-gray-400">
                              {field.description}
                            </div>
                          )}
                        </div>
                      ))}

                      {/* Enum Values */}
                      {type.enumValues && type.enumValues.map(enumValue => (
                        <div key={enumValue.name} className="py-2 border-b border-gray-100 dark:border-gray-800">
                          <div className="flex items-center space-x-2">
                            <Hash className="h-3 w-3 text-yellow-500" />
                            <span className="font-medium text-sm text-gray-800 dark:text-gray-200 font-mono">
                              {enumValue.name}
                            </span>
                          </div>
                          {enumValue.description && (
                            <div className="ml-5 mt-1 text-xs text-gray-500 dark:text-gray-400">
                              {enumValue.description}
                            </div>
                          )}
                        </div>
                      ))}

                      {/* Union Possible Types */}
                      {type.possibleTypes && type.possibleTypes.map(possibleType => (
                        <div key={possibleType} className="py-2 border-b border-gray-100 dark:border-gray-800">
                          <div className="flex items-center space-x-2">
                            <Link className="h-3 w-3 text-orange-500" />
                            <button
                              onClick={() => handleTypeClick(possibleType)}
                              className="font-medium text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
                            >
                              {possibleType}
                            </button>
                          </div>
                        </div>
                      ))}

                      {/* Interface implementations */}
                      {type.interfaces && type.interfaces.length > 0 && (
                        <div className="py-2 border-b border-gray-100 dark:border-gray-800">
                          <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Implements:
                          </div>
                          {type.interfaces.map(interfaceName => (
                            <div key={interfaceName} className="flex items-center space-x-2 ml-2">
                              <GitBranch className="h-3 w-3 text-cyan-500" />
                              <button
                                onClick={() => handleTypeClick(interfaceName)}
                                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
                              >
                                {interfaceName}
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 