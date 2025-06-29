import { 
  buildSchema, 
  GraphQLSchema, 
  GraphQLObjectType, 
  GraphQLInterfaceType, 
  GraphQLUnionType, 
  GraphQLEnumType, 
  GraphQLScalarType,
  GraphQLInputObjectType,
  GraphQLField,
  GraphQLInputField,
  GraphQLType,
  GraphQLNonNull,
  GraphQLList,
  isNonNullType,
  isListType,
  isObjectType,
  isInterfaceType,
  isUnionType,
  isEnumType,
  isScalarType,
  isInputObjectType,
  getIntrospectionQuery,
  buildClientSchema,
  IntrospectionQuery
} from 'graphql'

export interface SchemaTypeInfo {
  name: string
  kind: 'OBJECT' | 'INTERFACE' | 'UNION' | 'ENUM' | 'SCALAR' | 'INPUT_OBJECT'
  description?: string
  fields?: SchemaFieldInfo[]
  inputFields?: SchemaInputFieldInfo[]
  possibleTypes?: string[] // for unions
  interfaces?: string[] // for objects implementing interfaces
  enumValues?: { name: string; description?: string }[]
  isBuiltIn: boolean
}

export interface SchemaFieldInfo {
  name: string
  type: string
  description?: string
  args?: SchemaArgumentInfo[]
  isDeprecated?: boolean
  deprecationReason?: string
}

export interface SchemaInputFieldInfo {
  name: string
  type: string
  description?: string
  defaultValue?: string
}

export interface SchemaArgumentInfo {
  name: string
  type: string
  description?: string
  defaultValue?: string
}

export interface ParsedSchema {
  types: SchemaTypeInfo[]
  queryType?: string
  mutationType?: string
  subscriptionType?: string
  relationships: SchemaRelationship[]
}

export interface SchemaRelationship {
  from: string
  to: string
  type: 'field' | 'implements' | 'union' | 'input'
  fieldName?: string
}

// Built-in GraphQL scalar types
const BUILT_IN_SCALARS = new Set([
  'String', 'Int', 'Float', 'Boolean', 'ID'
])

const BUILT_IN_DIRECTIVES = new Set([
  '__Schema', '__Type', '__Field', '__InputValue', '__EnumValue', '__Directive'
])

export const parseGraphQLSchema = (schemaText: string): ParsedSchema => {
  try {
    const schema = buildSchema(schemaText)
    return parseSchemaFromGraphQL(schema)
  } catch (error) {
    throw new Error(`Failed to parse schema: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export const parseSchemaFromIntrospection = (introspectionResult: IntrospectionQuery): ParsedSchema => {
  try {
    const schema = buildClientSchema(introspectionResult)
    return parseSchemaFromGraphQL(schema)
  } catch (error) {
    throw new Error(`Failed to parse introspection result: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

const parseSchemaFromGraphQL = (schema: GraphQLSchema): ParsedSchema => {
  const typeMap = schema.getTypeMap()
  const types: SchemaTypeInfo[] = []
  const relationships: SchemaRelationship[] = []

  // Process all types
  Object.values(typeMap).forEach(type => {
    // Skip introspection types and built-in directives
    if (type.name.startsWith('__')) return

    const typeInfo = parseType(type)
    if (typeInfo) {
      types.push(typeInfo)
      
      // Extract relationships
      relationships.push(...extractRelationships(type))
    }
  })

  // Get root types
  const queryType = schema.getQueryType()?.name
  const mutationType = schema.getMutationType()?.name
  const subscriptionType = schema.getSubscriptionType()?.name

  return {
    types: types.sort((a, b) => {
      // Sort: root types first, then by name
      if (a.name === queryType) return -1
      if (b.name === queryType) return 1
      if (a.name === mutationType) return -1
      if (b.name === mutationType) return 1
      if (a.name === subscriptionType) return -1
      if (b.name === subscriptionType) return 1
      return a.name.localeCompare(b.name)
    }),
    queryType,
    mutationType,
    subscriptionType,
    relationships
  }
}

const parseType = (type: GraphQLType): SchemaTypeInfo | null => {
  if (!('name' in type)) return null
  
  const name = type.name
  const description = ('description' in type ? type.description : undefined) || undefined
  const isBuiltIn = BUILT_IN_SCALARS.has(name) || BUILT_IN_DIRECTIVES.has(name)

  if (isObjectType(type)) {
    const fields = Object.values(type.getFields()).map(field => parseField(field))
    const interfaces = type.getInterfaces().map(iface => iface.name)

    return {
      name,
      kind: 'OBJECT',
      description,
      fields,
      interfaces: interfaces.length > 0 ? interfaces : undefined,
      isBuiltIn
    }
  }

  if (isInterfaceType(type)) {
    const fields = Object.values(type.getFields()).map(field => parseField(field))

    return {
      name,
      kind: 'INTERFACE',
      description,
      fields,
      isBuiltIn
    }
  }

  if (isUnionType(type)) {
    const possibleTypes = type.getTypes().map(t => t.name)

    return {
      name,
      kind: 'UNION',
      description,
      possibleTypes,
      isBuiltIn
    }
  }

  if (isEnumType(type)) {
    const enumValues = type.getValues().map(value => ({
      name: value.name,
      description: value.description || undefined
    }))

    return {
      name,
      kind: 'ENUM',
      description,
      enumValues,
      isBuiltIn
    }
  }

  if (isInputObjectType(type)) {
    const inputFields = Object.values(type.getFields()).map(field => parseInputField(field))

    return {
      name,
      kind: 'INPUT_OBJECT',
      description,
      inputFields,
      isBuiltIn
    }
  }

  if (isScalarType(type)) {
    return {
      name,
      kind: 'SCALAR',
      description,
      isBuiltIn
    }
  }

  return null
}

const parseField = (field: GraphQLField<any, any>): SchemaFieldInfo => {
  const args = field.args.map(arg => ({
    name: arg.name,
    type: getTypeString(arg.type),
    description: arg.description || undefined,
    defaultValue: arg.defaultValue !== undefined ? String(arg.defaultValue) : undefined
  }))

  return {
    name: field.name,
    type: getTypeString(field.type),
    description: field.description || undefined,
    args: args.length > 0 ? args : undefined,
    isDeprecated: ('isDeprecated' in field ? Boolean(field.isDeprecated) : false),
    deprecationReason: ('deprecationReason' in field ? field.deprecationReason : undefined) || undefined
  }
}

const parseInputField = (field: GraphQLInputField): SchemaInputFieldInfo => {
  return {
    name: field.name,
    type: getTypeString(field.type),
    description: field.description || undefined,
    defaultValue: field.defaultValue !== undefined ? String(field.defaultValue) : undefined
  }
}

const getTypeString = (type: GraphQLType): string => {
  if (isNonNullType(type)) {
    return `${getTypeString(type.ofType)}!`
  }
  
  if (isListType(type)) {
    return `[${getTypeString(type.ofType)}]`
  }
  
  return type.name
}

const extractRelationships = (type: GraphQLType): SchemaRelationship[] => {
  const relationships: SchemaRelationship[] = []
  if (!('name' in type)) return relationships
  const typeName = type.name

  if (isObjectType(type)) {
    // Field relationships
    Object.values(type.getFields()).forEach(field => {
      const fieldType = getBaseTypeName(field.type)
      if (fieldType !== typeName && !BUILT_IN_SCALARS.has(fieldType)) {
        relationships.push({
          from: typeName,
          to: fieldType,
          type: 'field',
          fieldName: field.name
        })
      }
    })

    // Interface implementations
    type.getInterfaces().forEach(iface => {
      relationships.push({
        from: typeName,
        to: iface.name,
        type: 'implements'
      })
    })
  }

  if (isInterfaceType(type)) {
    // Field relationships
    Object.values(type.getFields()).forEach(field => {
      const fieldType = getBaseTypeName(field.type)
      if (fieldType !== typeName && !BUILT_IN_SCALARS.has(fieldType)) {
        relationships.push({
          from: typeName,
          to: fieldType,
          type: 'field',
          fieldName: field.name
        })
      }
    })
  }

  if (isUnionType(type)) {
    // Union member relationships
    type.getTypes().forEach(memberType => {
      relationships.push({
        from: typeName,
        to: memberType.name,
        type: 'union'
      })
    })
  }

  if (isInputObjectType(type)) {
    // Input field relationships
    Object.values(type.getFields()).forEach(field => {
      const fieldType = getBaseTypeName(field.type)
      if (fieldType !== typeName && !BUILT_IN_SCALARS.has(fieldType)) {
        relationships.push({
          from: typeName,
          to: fieldType,
          type: 'input',
          fieldName: field.name
        })
      }
    })
  }

  return relationships
}

const getBaseTypeName = (type: GraphQLType): string => {
  if (isNonNullType(type) || isListType(type)) {
    return getBaseTypeName(type.ofType)
  }
  return type.name
} 