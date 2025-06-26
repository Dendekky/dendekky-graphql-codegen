'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ModeToggle } from '@/components/mode-toggle'
import { generateTypes } from '@/lib/actions'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { Copy, Check, Download } from 'lucide-react'

function GraphQLCodegenContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const graphqlApiEndpoint = searchParams.get('graphqlApiEndpoint')
  
  const [endpoint, setEndpoint] = useState(graphqlApiEndpoint || '')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!endpoint.trim()) {
      setError('Please enter a GraphQL endpoint')
      return
    }

    setLoading(true)
    setError('')
    setResult('')

    try {
      const response = await generateTypes(endpoint.trim())
      
      if (response.success) {
        setResult(response.data || '')
      } else {
        setError(response.error || 'Failed to generate types')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleGoHome = () => {
    router.push('/')
    setEndpoint('')
    setResult('')
    setError('')
    setCopied(false)
  }

  const handleCopy = async () => {
    if (!result) return
    
    try {
      await navigator.clipboard.writeText(result)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleDownload = () => {
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
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-4xl font-bold tracking-tight">
            GraphQL Codegen Web Wrapper
          </h1>
          <ModeToggle />
        </div>
        <p className="text-muted-foreground">
          Generate TypeScript types from GraphQL schemas
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle>GraphQL Endpoint</CardTitle>
            <CardDescription>
              Enter a GraphQL API endpoint to generate TypeScript types
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="url"
                  placeholder="https://swapi-graphql.netlify.app/.netlify/functions/index"
                  value={endpoint}
                  onChange={(e) => setEndpoint(e.target.value)}
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? 'Generating...' : 'Generate Types'}
                </Button>
                {(result || error) && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleGoHome}
                  >
                    Clear
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Generated Types</CardTitle>
                {/* <CardDescription>
                  TypeScript type definitions will appear here
                </CardDescription> */}
              </div>
              {result && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    className="flex items-center gap-2"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4" />
                        Copied!
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
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {loading && (
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            )}
            
            {error && (
              <div className="p-4 border-l-4 border-destructive bg-destructive/10 text-destructive">
                <p className="font-medium">Error:</p>
                <p className="text-sm">{error}</p>
              </div>
            )}
            
            {result && (
              <Textarea
                value={result}
                readOnly
                className="font-mono text-sm min-h-[400px] resize-none"
                placeholder="Generated TypeScript types will appear here..."
              />
            )}
            
            {!loading && !result && !error && (
              <div className="text-center text-muted-foreground p-8">
                <p>Enter a GraphQL endpoint and click &quot;Generate Types&quot; to get started</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Guide Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Quick Start Guide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Using URL Parameters</h3>
            <p className="text-sm text-muted-foreground">
              You can also pass the GraphQL endpoint as a URL parameter:
            </p>
            <code className="block mt-1 p-2 bg-muted rounded text-sm">
              {typeof window !== 'undefined' && window.location.origin}/?graphqlApiEndpoint=https://your-api.com/graphql
            </code>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Example Endpoints</h3>
            <p className="text-sm text-muted-foreground">Try these public GraphQL APIs:</p>
            <ul className="text-sm text-muted-foreground list-disc list-inside mt-1 space-y-1">
              <li>Countries API: https://countries.trevorblades.com/</li>
              <li>SpaceX API: https://spacex-production.up.railway.app/</li>
              <li>Star Wars API: https://swapi-graphql.netlify.app/.netlify/functions/index</li>
            </ul>
          </div>
        </CardContent>
      </Card>
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