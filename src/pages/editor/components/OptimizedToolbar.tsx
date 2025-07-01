import React from 'react'
import { Button } from '@/components/ui/button'
import { Bold, Italic, Underline, Strikethrough } from 'lucide-react'
import { useEditorTextFormatting, useEditorActions, useEditorFont, useEditorDocumentState } from '../context'

// This component only re-renders when text formatting changes
export const OptimizedToolbar = () => {
    const { isBold, isItalic, isUnderline, isStrike } = useEditorTextFormatting()
    const { setBold, setItalic, setUnderline, setStrike } = useEditorActions()

    console.log('OptimizedToolbar rendered - only when text formatting changes')

    return (
        <div className="flex items-center gap-1 p-2 border rounded">
            <Button
                variant={isBold ? 'default' : 'outline'}
                size="sm"
                onClick={() => setBold(!isBold)}
            >
                <Bold className="h-4 w-4" />
            </Button>
            <Button
                variant={isItalic ? 'default' : 'outline'}
                size="sm"
                onClick={() => setItalic(!isItalic)}
            >
                <Italic className="h-4 w-4" />
            </Button>
            <Button
                variant={isUnderline ? 'default' : 'outline'}
                size="sm"
                onClick={() => setUnderline(!isUnderline)}
            >
                <Underline className="h-4 w-4" />
            </Button>
            <Button
                variant={isStrike ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStrike(!isStrike)}
            >
                <Strikethrough className="h-4 w-4" />
            </Button>
        </div>
    )
}

// This component only re-renders when font settings change
export const OptimizedFontSelector = () => {
    const { fontSize, fontFamily } = useEditorFont()
    const { setFontSize, setFontFamily } = useEditorActions()

    console.log('OptimizedFontSelector rendered - only when font settings change')

    return (
        <div className="flex items-center gap-2 p-2 border rounded">
            <span>Font: {fontFamily}</span>
            <span>Size: {fontSize}px</span>
        </div>
    )
}

// This component only re-renders when document state changes
export const OptimizedDocumentStatus = () => {
    const { isDirty, isSaving } = useEditorDocumentState()

    console.log('OptimizedDocumentStatus rendered - only when document state changes')

    return (
        <div className="p-2 border rounded">
            <div>Dirty: {isDirty ? 'Yes' : 'No'}</div>
            <div>Saving: {isSaving ? 'Yes' : 'No'}</div>
        </div>
    )
} 