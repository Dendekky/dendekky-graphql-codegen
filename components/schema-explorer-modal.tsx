'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { SchemaVisualizer } from '@/components/schema-visualizer'
import { ParsedSchema } from '@/lib/schema-parser'
import { Database, X } from 'lucide-react'

interface SchemaExplorerModalProps {
  schema: ParsedSchema
  isOpen: boolean
  onClose: () => void
}

export function SchemaExplorerModal({ schema, isOpen, onClose }: SchemaExplorerModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] flex flex-col bg-gray-900/95 border-white/20 backdrop-blur-md">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Database className="h-5 w-5 text-purple-400" />
            Schema Explorer
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Interactive visualization of your GraphQL schema structure
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden min-h-0">
          <SchemaVisualizer schema={schema} />
        </div>

        <div className="flex-shrink-0 flex justify-end pt-4 border-t border-white/10">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="bg-white/5 border-white/20 hover:bg-white/10"
          >
            <X className="h-4 w-4 mr-2" />
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 