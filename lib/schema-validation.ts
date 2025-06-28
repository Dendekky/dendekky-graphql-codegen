import { buildSchema, GraphQLError } from 'graphql'
import { SchemaValidationError } from './store'

export const validateGraphQLSchema = (schemaText: string): { isValid: boolean; errors: SchemaValidationError[] } => {
  // Empty schema is considered valid (no validation needed)
  if (!schemaText.trim()) {
    return { isValid: true, errors: [] }
  }

  try {
    // Attempt to build the schema
    buildSchema(schemaText)
    return { isValid: true, errors: [] }
  } catch (error) {
    const errors: SchemaValidationError[] = []

    if (error instanceof GraphQLError) {
      // Extract line and column information from GraphQL error
      const location = error.locations?.[0]
      const message = error.message

      errors.push({
        message: formatErrorMessage(message),
        line: location?.line,
        column: location?.column,
        location: location ? `Line ${location.line}, Column ${location.column}` : undefined,
      })
    } else if (error instanceof Error) {
      // Handle other types of errors
      errors.push({
        message: formatErrorMessage(error.message),
      })
    } else {
      // Fallback for unknown error types
      errors.push({
        message: 'Invalid GraphQL schema: Unknown error occurred',
      })
    }

    return { isValid: false, errors }
  }
}

const formatErrorMessage = (message: string): string => {
  // Make error messages more user-friendly
  const improvements: Record<string, string> = {
    'Syntax Error': 'Schema Syntax Error',
    'Expected Name': 'Expected a valid GraphQL name (letters, numbers, underscores)',
    'Expected {': 'Expected opening brace "{"',
    'Expected }': 'Expected closing brace "}"',
    'Expected :': 'Expected colon ":"',
    'Unexpected character': 'Unexpected character in schema',
    'Unknown type': 'Unknown GraphQL type - make sure all types are defined',
    'Cannot query field': 'Invalid field definition',
  }

  let improvedMessage = message

  // Apply improvements
  for (const [original, improved] of Object.entries(improvements)) {
    if (message.includes(original)) {
      improvedMessage = improved
      break
    }
  }

  // Add helpful suggestions for common mistakes
  if (message.includes('Expected Name')) {
    improvedMessage += '. GraphQL names must start with a letter or underscore, followed by letters, numbers, or underscores.'
  } else if (message.includes('Unknown type')) {
    improvedMessage += '. Make sure to define all custom types before using them.'
  } else if (message.includes('Syntax Error')) {
    improvedMessage += '. Check for missing braces, colons, or incorrect field definitions.'
  }

  return improvedMessage
}

// Debounced validation function for real-time validation
export const createDebouncedValidator = (
  callback: (result: { isValid: boolean; errors: SchemaValidationError[] }) => void,
  delay: number = 500
) => {
  let timeoutId: NodeJS.Timeout | null = null

  return (schemaText: string) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      const result = validateGraphQLSchema(schemaText)
      callback(result)
    }, delay)
  }
} 