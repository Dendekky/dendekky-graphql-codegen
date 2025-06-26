'use server'

import { codegen } from '@graphql-codegen/core'
import { printSchema, parse, GraphQLSchema } from 'graphql'
import * as typescriptPlugin from '@graphql-codegen/typescript'

const generateConfig = (schema: GraphQLSchema) => ({
  documents: [],
  config: {},
  filename: '',
  schema: parse(printSchema(schema)),
  plugins: [
    {
      typescript: {},
    },
  ],
  pluginMap: {
    typescript: typescriptPlugin,
  },
})

export async function generateTypes(
  graphqlApiEndpoint: string, 
  headers?: Record<string, string>,
  signal?: AbortSignal
) {
  try {
    // Dynamic import to avoid SSR issues with GraphQL Tools
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
    
    const schema = await loadSchema(graphqlApiEndpoint, schemaOptions)
    const config = generateConfig(schema)
    const output = await codegen(config)
    
    return { success: true, data: output }
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