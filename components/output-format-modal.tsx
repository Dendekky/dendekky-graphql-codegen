'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { OutputFormatSelector, OUTPUT_FORMATS } from '@/components/output-format-selector'
import { DocumentsInput } from '@/components/documents-input'
import { useCodegenStore, useIsBasicTypescript } from '@/lib/store'
import { Settings, Code2, Zap, FileText } from 'lucide-react'

export function OutputFormatModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [tempFormats, setTempFormats] = useState<string[]>([])
  const [tempDocuments, setTempDocuments] = useState<string>('')

  // Zustand store hooks
  const { outputFormats, documents, setOutputFormats, setDocuments } = useCodegenStore()
  const isBasicTypescript = useIsBasicTypescript()

  const handleOpen = () => {
    // Reset temp state to current values when opening
    setTempFormats(outputFormats)
    setTempDocuments(documents)
    setIsOpen(true)
  }

  const handleSave = () => {
    setOutputFormats(tempFormats)
    setDocuments(tempDocuments)
    setIsOpen(false)
  }

  const handleCancel = () => {
    // Reset temp state to original values
    setTempFormats(outputFormats)
    setTempDocuments(documents)
    setIsOpen(false)
  }

  const requiresDocuments = tempFormats.some((format: string) => 
    OUTPUT_FORMATS.find(f => f.id === format)?.requiresDocuments
  )

  const formatCount = outputFormats.length
  const hasAdvancedFormats = outputFormats.some((format: string) => format !== 'typescript')

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          onClick={handleOpen}
          className="flex items-center gap-2 bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30 transition-all duration-200"
        >
          <Settings className="h-4 w-4" />
          <span className="hidden sm:inline">
            {isBasicTypescript ? 'Output Formats' : 'Advanced Options'}
          </span>
          <span className="sm:hidden">Formats</span>
          
          {!isBasicTypescript && (
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 text-xs">
              {formatCount}
            </Badge>
          )}
          
                       {hasAdvancedFormats && (
             <div className="flex items-center gap-1">
               {outputFormats.slice(0, 3).map((format: string) => {
                 const formatInfo = OUTPUT_FORMATS.find(f => f.id === format)
                 const Icon = formatInfo?.icon || Code2
                 return (
                   <Icon key={format} className="h-3 w-3 text-blue-400" />
                 )
               })}
               {outputFormats.length > 3 && (
                 <span className="text-xs text-blue-400">+{outputFormats.length - 3}</span>
               )}
             </div>
           )}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col bg-gray-900/95 border-white/20 backdrop-blur-md">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FileText className="h-5 w-5 text-purple-400" />
            Configure Output Formats
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Choose which formats to generate from your GraphQL schema. 
            {tempFormats.length === 0 && " Select at least one format to continue."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6 py-4 min-h-0">
          {/* Current Selection Summary */}
          {tempFormats.length > 0 && (
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
              <h4 className="font-semibold text-blue-300 mb-2 flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Selected Formats ({tempFormats.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {tempFormats.map((format) => {
                  const formatInfo = OUTPUT_FORMATS.find(f => f.id === format)
                  const Icon = formatInfo?.icon || Code2
                  return (
                    <div key={format} className="flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-300 text-xs font-medium rounded-md">
                      <Icon className="h-3 w-3" />
                      {formatInfo?.name || format}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Output Format Selector */}
          <OutputFormatSelector 
            selectedFormats={tempFormats} 
            onChange={setTempFormats} 
          />

          {/* Documents Input - shown when required */}
          {requiresDocuments && (
            <DocumentsInput 
              documents={tempDocuments} 
              onChange={setTempDocuments} 
              isRequired={requiresDocuments}
            />
          )}
        </div>

        <DialogFooter className="flex-shrink-0 border-t border-white/10 pt-4">
          <div className="flex items-center justify-between w-full">
            <div className="text-sm text-gray-400">
              {tempFormats.length === 0 && "⚠️ At least one format is required"}
              {tempFormats.length === 1 && "✅ Basic configuration"}
              {tempFormats.length > 1 && `✅ ${tempFormats.length} formats selected`}
              {requiresDocuments && !tempDocuments.trim() && " • GraphQL operations required"}
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={handleCancel}
                className="bg-white/5 border-white/20 hover:bg-white/10"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                disabled={tempFormats.length === 0 || (requiresDocuments && !tempDocuments.trim())}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Apply Changes
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 