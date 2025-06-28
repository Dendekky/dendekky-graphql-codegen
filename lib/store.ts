import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { OUTPUT_FORMATS } from '@/components/output-format-selector'

export interface SchemaValidationError {
  message: string
  line?: number
  column?: number
  location?: string
}

export interface CodegenState {
  // Core form state
  inputMode: 'endpoint' | 'schema'
  endpoint: string
  schemaDefinition: string
  headers: Record<string, string>
  outputFormats: string[]
  documents: string
  
  // Schema validation state
  schemaValidation: {
    isValid: boolean
    errors: SchemaValidationError[]
    isValidating: boolean
  }
  
  // Result state
  result: string
  error: string
  loading: boolean
  
  // Performance metrics
  generationTime: number | null
  schemaSize: number | null
  typeCount: number | null
  
  // UI state
  copied: boolean
  showShortcuts: boolean
  
  // Request cancellation
  abortController: AbortController | null
}

export interface CodegenActions {
  // Form actions
  setInputMode: (mode: 'endpoint' | 'schema') => void
  setEndpoint: (endpoint: string) => void
  setSchemaDefinition: (schema: string) => void
  setHeaders: (headers: Record<string, string>) => void
  setOutputFormats: (formats: string[]) => void
  setDocuments: (documents: string) => void
  
  // Schema validation actions
  setSchemaValidation: (validation: { isValid: boolean; errors: SchemaValidationError[]; isValidating: boolean }) => void
  setSchemaValidating: (isValidating: boolean) => void
  
  // Result actions
  setResult: (result: string) => void
  setError: (error: string) => void
  setLoading: (loading: boolean) => void
  
  // Performance actions
  setGenerationTime: (time: number | null) => void
  setSchemaSize: (size: number | null) => void
  setTypeCount: (count: number | null) => void
  
  // UI actions
  setCopied: (copied: boolean) => void
  setShowShortcuts: (show: boolean) => void
  
  // Request management
  setAbortController: (controller: AbortController | null) => void
  
  // Complex actions
  clearAll: () => void
  clearResults: () => void
  resetToBasicTypes: () => void
}

export type CodegenStore = CodegenState & CodegenActions

// Get initial endpoint from URL params if available
const getInitialEndpoint = () => {
  if (typeof window === 'undefined') return ''
  const params = new URLSearchParams(window.location.search)
  return params.get('graphqlApiEndpoint') || ''
}

const initialState: CodegenState = {
  inputMode: 'endpoint',
  endpoint: getInitialEndpoint(),
  schemaDefinition: '',
  headers: {},
  outputFormats: ['typescript'],
  documents: '',
  schemaValidation: {
    isValid: true,
    errors: [],
    isValidating: false,
  },
  result: '',
  error: '',
  loading: false,
  generationTime: null,
  schemaSize: null,
  typeCount: null,
  copied: false,
  showShortcuts: false,
  abortController: null,
}

export const useCodegenStore = create<CodegenStore>()(
  devtools(
    (set, get) => ({
      ...initialState,
      
      // Form actions
      setInputMode: (inputMode) => set({ inputMode }, false, 'setInputMode'),
      setEndpoint: (endpoint) => set({ endpoint }, false, 'setEndpoint'),
      setSchemaDefinition: (schemaDefinition) => set({ schemaDefinition }, false, 'setSchemaDefinition'),
      
      setHeaders: (headers) => set({ headers }, false, 'setHeaders'),
      
      setOutputFormats: (formats) => {
        const currentFormats = get().outputFormats
        const currentDocuments = get().documents
        
        // Check if any formats were removed
        const removedFormats = currentFormats.filter(format => !formats.includes(format))
        const addedFormats = formats.filter(format => !currentFormats.includes(format))
        
        // If formats requiring documents were removed, clear documents if no remaining formats need them
        if (removedFormats.length > 0) {
          const stillRequiresDocuments = formats.some(format => 
            OUTPUT_FORMATS.find(f => f.id === format)?.requiresDocuments
          )
          
          const updates: Partial<CodegenState> = { outputFormats: formats }
          
          // Clear documents if no remaining formats require them
          if (!stillRequiresDocuments && currentDocuments) {
            updates.documents = ''
          }
          
          // Clear results when changing formats
          updates.result = ''
          updates.error = ''
          updates.generationTime = null
          updates.schemaSize = null
          updates.typeCount = null
          
          set(updates, false, 'setOutputFormats')
        } else {
          // Just adding formats, clear results but keep documents
          set({ 
            outputFormats: formats,
            result: '',
            error: '',
            generationTime: null,
            schemaSize: null,
            typeCount: null,
          }, false, 'setOutputFormats')
        }
      },
      
      setDocuments: (documents) => set({ documents }, false, 'setDocuments'),
      
      // Schema validation actions
      setSchemaValidation: (schemaValidation) => set({ schemaValidation }, false, 'setSchemaValidation'),
      setSchemaValidating: (isValidating) => set((state) => ({
        schemaValidation: { ...state.schemaValidation, isValidating }
      }), false, 'setSchemaValidating'),
      
      // Result actions
      setResult: (result) => set({ result }, false, 'setResult'),
      setError: (error) => set({ error }, false, 'setError'),
      setLoading: (loading) => set({ loading }, false, 'setLoading'),
      
      // Performance actions
      setGenerationTime: (generationTime) => set({ generationTime }, false, 'setGenerationTime'),
      setSchemaSize: (schemaSize) => set({ schemaSize }, false, 'setSchemaSize'),
      setTypeCount: (typeCount) => set({ typeCount }, false, 'setTypeCount'),
      
      // UI actions
      setCopied: (copied) => set({ copied }, false, 'setCopied'),
      setShowShortcuts: (showShortcuts) => set({ showShortcuts }, false, 'setShowShortcuts'),
      
      // Request management
      setAbortController: (abortController) => set({ abortController }, false, 'setAbortController'),
      
      // Complex actions
      clearAll: () => {
        const { abortController } = get()
        
        // Cancel any ongoing request
        if (abortController) {
          abortController.abort()
        }
        
        set({
          ...initialState,
          // Preserve URL params endpoint if it exists
          endpoint: getInitialEndpoint() || '',
          // Reset to endpoint mode when clearing
          inputMode: 'endpoint',
        }, false, 'clearAll')
      },
      
      clearResults: () => set({
        result: '',
        error: '',
        generationTime: null,
        schemaSize: null,
        typeCount: null,
        copied: false,
      }, false, 'clearResults'),
      
      resetToBasicTypes: () => set({
        outputFormats: ['typescript'],
        documents: '',
        result: '',
        error: '',
        generationTime: null,
        schemaSize: null,
        typeCount: null,
      }, false, 'resetToBasicTypes'),
    }),
    {
      name: 'codegen-store',
      // Only store essential state in localStorage
      partialize: (state: CodegenStore) => ({
        inputMode: state.inputMode,
        endpoint: state.endpoint,
        schemaDefinition: state.schemaDefinition,
        headers: state.headers,
        outputFormats: state.outputFormats,
        documents: state.documents,
      }),
    }
  )
)

// Selectors for commonly used combinations
export const useFormState = () => useCodegenStore((state) => ({
  inputMode: state.inputMode,
  endpoint: state.endpoint,
  schemaDefinition: state.schemaDefinition,
  headers: state.headers,
  outputFormats: state.outputFormats,
  documents: state.documents,
}))

export const useResultState = () => useCodegenStore((state) => ({
  result: state.result,
  error: state.error,
  loading: state.loading,
  generationTime: state.generationTime,
  schemaSize: state.schemaSize,
  typeCount: state.typeCount,
}))

export const useUIState = () => useCodegenStore((state) => ({
  copied: state.copied,
  showShortcuts: state.showShortcuts,
}))

export const useSchemaValidation = () => useCodegenStore((state) => ({
  schemaValidation: state.schemaValidation,
  setSchemaValidation: state.setSchemaValidation,
  setSchemaValidating: state.setSchemaValidating,
}))

// Computed selectors
export const useRequiresDocuments = () => useCodegenStore((state) => 
  state.outputFormats.some(format => 
    OUTPUT_FORMATS.find(f => f.id === format)?.requiresDocuments
  )
)

export const useCanGenerate = () => useCodegenStore((state) => {
  const requiresDocuments = state.outputFormats.some(format => 
    OUTPUT_FORMATS.find(f => f.id === format)?.requiresDocuments
  )
  
  const hasValidInput = state.inputMode === 'endpoint' 
    ? state.endpoint.trim()
    : state.schemaDefinition.trim()

  // For schema mode, also check if schema is valid and not currently validating
  const isSchemaInputValid = state.inputMode === 'endpoint' || 
    (state.schemaValidation.isValid && !state.schemaValidation.isValidating)
  
  return hasValidInput && 
         state.outputFormats.length > 0 && 
         (!requiresDocuments || state.documents.trim()) &&
         isSchemaInputValid
})

export const useIsBasicTypescript = () => useCodegenStore((state) => 
  state.outputFormats.length === 1 && state.outputFormats[0] === 'typescript'
) 