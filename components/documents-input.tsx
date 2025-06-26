'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { FileText, Eye, EyeOff, Code2, BookOpen } from 'lucide-react'

interface DocumentsInputProps {
  documents: string
  onChange: (documents: string) => void
  isRequired: boolean
}

const EXAMPLE_DOCUMENTS = {
  basic: `query GetUser($id: ID!) {
  user(id: $id) {
    id
    name
    email
  }
}

mutation CreateUser($input: CreateUserInput!) {
  createUser(input: $input) {
    id
    name
    email
  }
}`,
  
  withFragments: `fragment UserFields on User {
  id
  name
  email
  avatar
}

query GetUsers($limit: Int) {
  users(limit: $limit) {
    ...UserFields
  }
}

query GetUser($id: ID!) {
  user(id: $id) {
    ...UserFields
    posts {
      id
      title
      content
    }
  }
}`,
  
  subscription: `subscription OnCommentAdded($postId: ID!) {
  commentAdded(postId: $postId) {
    id
    content
    author {
      id
      name
    }
  }
}`
}

export function DocumentsInput({ documents, onChange, isRequired }: DocumentsInputProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeExample, setActiveExample] = useState<keyof typeof EXAMPLE_DOCUMENTS>('basic')

  const insertExample = (exampleKey: keyof typeof EXAMPLE_DOCUMENTS) => {
    onChange(EXAMPLE_DOCUMENTS[exampleKey])
    setActiveExample(exampleKey)
    setIsExpanded(true)
  }

  const hasDocuments = documents.trim().length > 0

  return (
    <Card className="border border-white/20 bg-white/5 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader 
        className="cursor-pointer select-none hover:bg-white/5 transition-colors duration-200 rounded-t-lg"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <CardTitle className="flex items-center justify-between text-sm font-medium">
          <div className="flex items-center gap-2">
            {isExpanded ? (
              <EyeOff className="h-4 w-4 text-blue-400" />
            ) : (
              <Eye className="h-4 w-4 text-blue-400" />
            )}
            <FileText className="h-4 w-4 text-purple-400" />
            <span>GraphQL Operations</span>
            {isRequired && (
              <Badge variant="destructive" className="bg-red-500/20 text-red-400 text-xs">
                Required
              </Badge>
            )}
            {hasDocuments && (
              <Badge variant="secondary" className="bg-green-500/20 text-green-400 text-xs">
                {documents.split(/\b(query|mutation|subscription)\b/i).length - 1} operations
              </Badge>
            )}
          </div>
          <Code2 className="h-4 w-4 text-gray-400" />
        </CardTitle>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-4">
          {/* Quick Examples */}
          <div className="space-y-2">
            <p className="text-xs text-gray-400 font-medium">Quick Examples:</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => insertExample('basic')}
                className="justify-start text-xs h-auto py-2 px-3 bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30"
              >
                <span className="font-medium text-blue-400">Basic Query & Mutation</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => insertExample('withFragments')}
                className="justify-start text-xs h-auto py-2 px-3 bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30"
              >
                <span className="font-medium text-purple-400">With Fragments</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => insertExample('subscription')}
                className="justify-start text-xs h-auto py-2 px-3 bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30"
              >
                <span className="font-medium text-green-400">Subscription</span>
              </Button>
            </div>
          </div>

          {/* Documents Textarea */}
          <div className="space-y-2">
            <label className="text-xs text-gray-400 font-medium">
              GraphQL Operations:
            </label>
            <Textarea
              placeholder={`Enter your GraphQL operations here...

Example:
query GetUser($id: ID!) {
  user(id: $id) {
    id
    name
    email
  }
}

mutation CreateUser($input: CreateUserInput!) {
  createUser(input: $input) {
    id
    name
    email
  }
}`}
              value={documents}
              onChange={(e) => onChange(e.target.value)}
              className="min-h-[300px] bg-white/5 border-white/20 focus:border-blue-400/50 font-mono text-sm"
            />
          </div>

          {/* Help Text */}
          <div className="text-xs text-gray-500 space-y-1 p-3 bg-white/5 rounded-lg border border-white/10">
            <p className="font-medium text-gray-400 flex items-center gap-2">
              <BookOpen className="h-3 w-3" />
              Why GraphQL Operations?
            </p>
            <p>• <span className="font-medium text-blue-400">Client SDKs</span> need operations to generate hooks, functions, and typed queries</p>
            <p>• <span className="font-medium text-green-400">Type-safe Clients</span> generate specific types for your actual queries and mutations</p>
            <p>• <span className="font-medium text-purple-400">Better DX</span> - Get autocomplete and type checking for your specific operations</p>
            <p className="text-xs text-gray-600 mt-2">
              💡 <strong>Tip:</strong> You can define queries, mutations, subscriptions, and fragments in this field
            </p>
          </div>
        </CardContent>
      )}
    </Card>
  )
} 