'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ModeToggle } from '@/components/mode-toggle'
import { generateTypes } from '@/lib/actions'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTheme } from 'next-themes'
import { Suspense } from 'react'
import { Copy, Check, Download, Zap, Code2, Sparkles, Clock, Database, Keyboard } from 'lucide-react'

function GraphQLCodegenContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setTheme, theme } = useTheme()
  const graphqlApiEndpoint = searchParams.get('graphqlApiEndpoint')
  
  const [endpoint, setEndpoint] = useState(graphqlApiEndpoint || '')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [copied, setCopied] = useState(false)
  const [showShortcuts, setShowShortcuts] = useState(false)
  
  // Performance metrics
  const [generationTime, setGenerationTime] = useState<number | null>(null)
  const [schemaSize, setSchemaSize] = useState<number | null>(null)
  const [typeCount, setTypeCount] = useState<number | null>(null)

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    
    if (!endpoint.trim()) {
      setError('Please enter a GraphQL endpoint')
      return
    }

    setLoading(true)
    setError('')
    setResult('')
    setGenerationTime(null)
    setSchemaSize(null)
    setTypeCount(null)

    const startTime = performance.now()

    try {
      const response = await generateTypes(endpoint.trim())
      
      const endTime = performance.now()
      const timeTaken = Math.round(endTime - startTime)
      
      if (response.success) {
        const generatedCode = response.data || ''
        setResult(generatedCode)
        setGenerationTime(timeTaken)
        
        // Calculate metrics
        const sizeInBytes = new Blob([generatedCode]).size
        setSchemaSize(sizeInBytes)
        
        // Count types (rough estimation by counting "export" statements)
        const typeMatches = generatedCode.match(/export\s+(type|interface|enum)/g)
        setTypeCount(typeMatches ? typeMatches.length : 0)
      } else {
        setError(response.error || 'Failed to generate types')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleClear = useCallback(() => {
    router.push('/')
    setEndpoint('')
    setResult('')
    setError('')
    setCopied(false)
    setGenerationTime(null)
    setSchemaSize(null)
    setTypeCount(null)
    // Focus the input after clearing
    setTimeout(() => {
      const input = document.querySelector('input[type="url"]') as HTMLInputElement
      input?.focus()
    }, 100)
  }, [router])

  const handleCopy = useCallback(async () => {
    if (!result) return
    
    try {
      await navigator.clipboard.writeText(result)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }, [result])

  const handleDownload = useCallback(() => {
    if (!result) return
    
    // Create blob with TypeScript content
    const blob = new Blob([result], { type: 'text/typescript' })
    const url = URL.createObjectURL(blob)
    
    // Create download link
    const a = document.createElement('a')
    a.href = url
    a.download = 'generated-types.ts'
    document.body.appendChild(a)
    a.click()
    
    // Cleanup
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [result])

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }, [theme, setTheme])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Enter or Cmd+Enter - Generate types
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault()
        if (!loading && endpoint.trim()) {
          handleSubmit()
        }
      }
      
      // Ctrl+D or Cmd+D - Download
      if ((e.ctrlKey || e.metaKey) && e.key === 'd' && result) {
        e.preventDefault()
        handleDownload()
      }
      
      // Escape - Close modal first, then clear form
      if (e.key === 'Escape') {
        e.preventDefault()
        if (showShortcuts) {
          setShowShortcuts(false)
        } else {
          handleClear()
        }
      }
      
      // Ctrl+Shift+T or Cmd+Shift+T - Toggle theme
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
        e.preventDefault()
        toggleTheme()
      }
      
      // Ctrl+/ or Cmd+/ - Show shortcuts
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault()
        setShowShortcuts(!showShortcuts)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [loading, endpoint, result, handleSubmit, handleDownload, handleClear, toggleTheme, showShortcuts])

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const formatTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`
    return `${(ms / 1000).toFixed(1)}s`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 dark:bg-yellow-900 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 dark:bg-pink-900 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Keyboard Shortcuts Modal */}
      {showShortcuts && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-white dark:bg-gray-900 border-0 shadow-2xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Keyboard className="h-5 w-5 text-purple-500" />
                  <CardTitle className="text-xl">Keyboard Shortcuts</CardTitle>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowShortcuts(false)}
                  className="h-8 w-8 p-0"
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between">
                  <span>Generate Types</span>
                  <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">Ctrl + Enter</kbd>
                </div>
                <div className="flex justify-between">
                  <span>Download Types</span>
                  <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">Ctrl + D</kbd>
                </div>
                <div className="flex justify-between">
                  <span>Clear/Reset</span>
                  <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">Escape</kbd>
                </div>
                <div className="flex justify-between">
                  <span>Toggle Theme</span>
                  <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">Ctrl + Shift + T</kbd>
                </div>
                <div className="flex justify-between">
                  <span>Show Shortcuts</span>
                  <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">Ctrl + /</kbd>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="relative container mx-auto p-6 max-w-6xl">
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                <Code2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
                  GraphQL Codegen Web Wrapper
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowShortcuts(true)}
                className="flex items-center gap-2"
              >
                <Keyboard className="h-4 w-4" />
                <span className="hidden sm:inline">Shortcuts</span>
              </Button>
              <ModeToggle />
            </div>
          </div>
          <div className="flex items-center space-x-2 text-lg text-muted-foreground">
            <Sparkles className="h-5 w-5 text-purple-500" />
            <p>Generate TypeScript types from GraphQL schemas with style</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold">GraphQL Endpoint</CardTitle>
                  <CardDescription className="text-base mt-1">
                    Enter a GraphQL API endpoint to generate TypeScript types
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                  <Input
                    type="url"
                    placeholder="https://swapi-graphql.netlify.app/.netlify/functions/index"
                    value={endpoint}
                    onChange={(e) => setEndpoint(e.target.value)}
                    required
                    className="h-12 text-base border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl shadow-sm transition-all duration-200"
                  />
                </div>
                <div className="flex gap-3">
                  <Button 
                    type="submit" 
                    disabled={loading} 
                    className="flex-1 h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-5 w-5 mr-2" />
                        Generate Types
                        <kbd className="ml-2 px-1.5 py-0.5 bg-white/20 rounded text-xs">Ctrl+↵</kbd>
                      </>
                    )}
                  </Button>
                  {(result || error) && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleClear}
                      className="h-12 px-6 border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
                    >
                      Clear
                    </Button>
                  )}
                </div>
              </form>

              {/* Performance Metrics */}
              {(generationTime !== null || schemaSize !== null) && (
                <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/30 dark:to-blue-950/30 rounded-xl border border-green-200 dark:border-green-800">
                  <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2 flex items-center">
                    <Database className="h-4 w-4 mr-2" />
                    Performance Metrics
                  </h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    {generationTime !== null && (
                      <div className="text-center">
                        <div className="flex items-center justify-center text-green-600 dark:text-green-400">
                          <Clock className="h-4 w-4 mr-1" />
                          <span className="font-medium">{formatTime(generationTime)}</span>
                        </div>
                        <div className="text-xs text-green-700 dark:text-green-300">Generation Time</div>
                      </div>
                    )}
                    {schemaSize !== null && (
                      <div className="text-center">
                        <div className="flex items-center justify-center text-blue-600 dark:text-blue-400">
                          <Database className="h-4 w-4 mr-1" />
                          <span className="font-medium">{formatFileSize(schemaSize)}</span>
                        </div>
                        <div className="text-xs text-blue-700 dark:text-blue-300">File Size</div>
                      </div>
                    )}
                    {typeCount !== null && (
                      <div className="text-center">
                        <div className="flex items-center justify-center text-purple-600 dark:text-purple-400">
                          <Code2 className="h-4 w-4 mr-1" />
                          <span className="font-medium">{typeCount}</span>
                        </div>
                        <div className="text-xs text-purple-700 dark:text-purple-300">Types Generated</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Output Section */}
          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg">
                    <Code2 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold">Generated Types</CardTitle>
                  </div>
                </div>
                {result && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopy}
                      className="flex items-center gap-2 border-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all duration-200"
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4 text-green-500" />
                          <span className="text-green-500">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          Copy
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownload}
                      className="flex items-center gap-2 border-2 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-all duration-200"
                    >
                      <Download className="h-4 w-4" />
                      Download
                      <kbd className="ml-1 px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs">Ctrl+D</kbd>
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {loading && (
                <div className="flex flex-col items-center justify-center p-12 space-y-4">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 dark:border-purple-800"></div>
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent absolute top-0"></div>
                  </div>
                  <p className="text-lg font-medium text-purple-600 dark:text-purple-400">Generating awesome types...</p>
                </div>
              )}
              
              {error && (
                <div className="p-6 border-l-4 border-red-500 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/50 dark:to-pink-950/50 rounded-r-xl">
                  <p className="font-semibold text-red-700 dark:text-red-300 text-lg">Error:</p>
                  <p className="text-red-600 dark:text-red-400 mt-1">{error}</p>
                </div>
              )}
              
              {result && (
                <div className="relative">
                  <Textarea
                    value={result}
                    readOnly
                    className="font-mono text-sm min-h-[400px] resize-none border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-inner bg-gray-50/50 dark:bg-gray-900/50 focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                    placeholder="Generated TypeScript types will appear here..."
                  />
                  <div className="absolute top-3 right-3 px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-xs font-medium rounded-md">
                    TypeScript
                  </div>
                </div>
              )}
              
              {!loading && !result && !error && (
                <div className="text-center p-12 space-y-4">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center">
                    <Code2 className="h-12 w-12 text-gray-400" />
                  </div>
                  <p className="text-lg text-muted-foreground">Enter a GraphQL endpoint and click &quot;Generate Types&quot; to get started</p>
                  <p className="text-sm text-muted-foreground">Or press <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">Ctrl + Enter</kbd> to generate</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Guide Section */}
        <Card className="mt-12 backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-0 shadow-xl">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold">Quick Start Guide</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 rounded-xl border border-blue-200 dark:border-blue-800">
                <h3 className="font-bold text-lg mb-3 text-blue-800 dark:text-blue-200">Using URL Parameters</h3>
                <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                  You can also pass the GraphQL endpoint as a URL parameter:
                </p>
                <code className="block p-3 bg-blue-100 dark:bg-blue-900/50 rounded-lg text-sm font-mono border border-blue-200 dark:border-blue-700">
                  {typeof window !== 'undefined' && window.location.origin}/?graphqlApiEndpoint=https://your-api.com/graphql
                </code>
              </div>
              <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 rounded-xl border border-green-200 dark:border-green-800">
                <h3 className="font-bold text-lg mb-3 text-green-800 dark:text-green-200">Example Endpoints</h3>
                <p className="text-sm text-green-700 dark:text-green-300 mb-3">Try these public GraphQL APIs:</p>
                <ul className="text-sm text-green-700 dark:text-green-300 space-y-2">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Countries API: https://countries.trevorblades.com/</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>SpaceX API: https://spacex-production.up.railway.app/</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Star Wars API: https://swapi-graphql.netlify.app/.netlify/functions/index</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GraphQLCodegenContent />
    </Suspense>
  )
} 