'use server'

import { codegen } from '@graphql-codegen/core'
import { printSchema, parse, GraphQLSchema, buildClientSchema, getIntrospectionQuery, introspectionFromSchema, buildSchema } from 'graphql'
import * as typescriptPlugin from '@graphql-codegen/typescript'
import * as typescriptOperationsPlugin from '@graphql-codegen/typescript-operations'
import * as typescriptResolversPlugin from '@graphql-codegen/typescript-resolvers'
import * as typescriptGraphqlRequestPlugin from '@graphql-codegen/typescript-graphql-request'
import * as typedDocumentNodePlugin from '@graphql-codegen/typed-document-node'
import * as typescriptReactQueryPlugin from '@graphql-codegen/typescript-react-query'

const pluginMap = {
  'typescript': typescriptPlugin,
  'typescript-operations': typescriptOperationsPlugin,
  'typescript-resolvers': typescriptResolversPlugin,
  'typescript-graphql-request': typescriptGraphqlRequestPlugin,
  'typed-document-node': typedDocumentNodePlugin,
  'typescript-react-query': typescriptReactQueryPlugin,
}

interface GenerateTypesRequest {
  endpoint?: string
  schemaDefinition?: string
  headers?: Record<string, string>
  outputFormats: string[]
  documents?: string
  signal?: AbortSignal
}

const generateConfig = (
  schema: GraphQLSchema, 
  outputFormats: string[], 
  documents?: string
) => {
  // Default to typescript if no formats selected
  const formats = outputFormats.length > 0 ? outputFormats : ['typescript']
  
  const plugins: any[] = []
  const config: Record<string, any> = {}

  // Handle different output format combinations
  for (const format of formats) {
    switch (format) {
      case 'typescript':
        plugins.push({ typescript: {} })
        break
      
      case 'typescript-operations':
        // Ensure typescript is included first
        if (!plugins.some(p => p.typescript !== undefined)) {
          plugins.unshift({ typescript: {} })
        }
        plugins.push({ 'typescript-operations': {} })
        break
      
      case 'typescript-resolvers':
        // Ensure typescript is included first
        if (!plugins.some(p => p.typescript !== undefined)) {
          plugins.unshift({ typescript: {} })
        }
        plugins.push({ 
          'typescript-resolvers': { 
            useIndexSignature: true 
          } 
        })
        break
      
      case 'typescript-graphql-request':
        // Ensure typescript and operations are included
        if (!plugins.some(p => p.typescript !== undefined)) {
          plugins.unshift({ typescript: {} })
        }
        if (!plugins.some(p => p['typescript-operations'] !== undefined)) {
          plugins.push({ 'typescript-operations': {} })
        }
        plugins.push({ 'typescript-graphql-request': {} })
        break
      
      case 'typed-document-node':
        // Ensure typescript and operations are included
        if (!plugins.some(p => p.typescript !== undefined)) {
          plugins.unshift({ typescript: {} })
        }
        if (!plugins.some(p => p['typescript-operations'] !== undefined)) {
          plugins.push({ 'typescript-operations': {} })
        }
        plugins.push({ 'typed-document-node': {} })
        break
      
      case 'typescript-react-query':
        // Ensure typescript and operations are included
        if (!plugins.some(p => p.typescript !== undefined)) {
          plugins.unshift({ typescript: {} })
        }
        if (!plugins.some(p => p['typescript-operations'] !== undefined)) {
          plugins.push({ 'typescript-operations': {} })
        }
        plugins.push({ 
          'typescript-react-query': { 
            fetcher: 'fetch',
            legacyMode: false
          } 
        })
        break
    }
  }

  return {
    documents: documents ? [{
      location: 'operations.graphql',
      document: parse(documents)
    }] : [],
    config,
    filename: '',
    schema: parse(printSchema(schema)),
    plugins,
    pluginMap,
  }
}

export async function generateTypes(
  endpointOrSchema: string, 
  headers?: Record<string, string>,
  outputFormats: string[] = ['typescript'],
  documents?: string,
  signal?: AbortSignal,
  isSchemaDefinition?: boolean,
  includeIntrospection?: boolean
) {
  try {
    let schema: GraphQLSchema;
    let introspectionResult = null;
    
          if (isSchemaDefinition) {
        // Handle direct schema definition
        try {
          schema = buildSchema(endpointOrSchema);
          // Get introspection from the built schema for visualization (if requested)
          if (includeIntrospection) {
            const rawIntrospection = introspectionFromSchema(schema);
            // Serialize to plain object for client transfer
            introspectionResult = JSON.parse(JSON.stringify(rawIntrospection));
          }
        } catch (parseError) {
          throw new Error(`Invalid GraphQL schema definition: ${parseError instanceof Error ? parseError.message : 'Unknown parsing error'}`);
        }
    } else {
      // Handle URL endpoint (existing logic)
      const { loadSchema } = await import('@graphql-tools/load')
      const { UrlLoader } = await import('@graphql-tools/url-loader')
      
      const fetchOptions: any = {}
      
      // Add custom headers if provided
      if (headers && Object.keys(headers).length > 0) {
        fetchOptions.headers = headers
      }
      
      // Add abort signal if provided
      if (signal) {
        fetchOptions.signal = signal
      }
      
      const schemaOptions = {
        loaders: [new UrlLoader()],
        ...(Object.keys(fetchOptions).length > 0 && {
          fetchOptions
        })
      }
      
      schema = await loadSchema(endpointOrSchema, schemaOptions)
      
      // Get introspection result for visualization (if requested)
      if (includeIntrospection) {
        try {
          const rawIntrospection = introspectionFromSchema(schema);
          // Serialize to plain object for client transfer
          introspectionResult = JSON.parse(JSON.stringify(rawIntrospection));
        } catch (introspectionError) {
          console.warn('Failed to get introspection for visualization:', introspectionError);
          // Continue without introspection - don't fail the whole operation
        }
      }
    }
    
    const config = generateConfig(schema, outputFormats, documents)
    const output = await codegen(config)
    
    return { 
      success: true, 
      data: output,
      introspection: introspectionResult,
      formatInfo: {
        selectedFormats: outputFormats,
        plugins: config.plugins.map(p => Object.keys(p)[0]),
        hasDocuments: !!documents
      }
    }
  } catch (error) {
    // Check if error is due to cancellation
    if (error instanceof Error && (error.name === 'AbortError' || error.message.includes('aborted'))) {
      return { 
        success: false, 
        error: 'Request was cancelled' 
      }
    }
    
    console.error('Error generating types:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }
  }
} 