import { EditorState } from './types'

/**
 * Validates if a font size is within acceptable range
 */
export function isValidFontSize(size: number): boolean {
    return size >= 8 && size <= 72
}

/**
 * Validates if a heading level is valid
 */
export function isValidHeadingLevel(level: number): boolean {
    return level >= 0 && level <= 6
}

/**
 * Gets the display name for a heading level
 */
export function getHeadingDisplayName(level: number): string {
    switch (level) {
        case 0:
            return 'Body Text'
        case 1:
            return 'Heading 1'
        case 2:
            return 'Heading 2'
        case 3:
            return 'Heading 3'
        case 4:
            return 'Heading 4'
        case 5:
            return 'Heading 5'
        case 6:
            return 'Heading 6'
        default:
            return 'Body Text'
    }
}

/**
 * Gets the display name for a font family
 */
export function getFontFamilyDisplayName(fontFamily: string): string {
    const fontMap: Record<string, string> = {
        inter: 'Inter',
        arial: 'Arial',
        times: 'Times New Roman',
        georgia: 'Georgia',
        verdana: 'Verdana',
        helvetica: 'Helvetica',
        courier: 'Courier New',
        monaco: 'Monaco',
    }
    return fontMap[fontFamily] || fontFamily
}

/**
 * Gets the display name for text alignment
 */
export function getTextAlignDisplayName(align: string): string {
    const alignMap: Record<string, string> = {
        left: 'Left',
        center: 'Center',
        right: 'Right',
        justify: 'Justify',
    }
    return alignMap[align] || 'Left'
}

/**
 * Checks if the editor state has any active formatting
 */
export function hasActiveFormatting(state: EditorState): boolean {
    return (
        state.isBold ||
        state.isItalic ||
        state.isUnderline ||
        state.isStrike ||
        state.isCode ||
        state.isHighlight ||
        state.isLink ||
        state.isBulletList ||
        state.isOrderedList ||
        state.isBlockquote ||
        state.headingLevel > 0
    )
}

/**
 * Checks if the editor state has any text formatting (excluding structural elements)
 */
export function hasTextFormatting(state: EditorState): boolean {
    return (
        state.isBold ||
        state.isItalic ||
        state.isUnderline ||
        state.isStrike ||
        state.isCode ||
        state.isHighlight ||
        state.isLink
    )
}

/**
 * Checks if the editor state has any structural formatting
 */
export function hasStructuralFormatting(state: EditorState): boolean {
    return (
        state.isBulletList ||
        state.isOrderedList ||
        state.isBlockquote ||
        state.headingLevel > 0
    )
}

/**
 * Creates a summary of the current editor state for debugging
 */
export function getEditorStateSummary(state: EditorState): string {
    const activeFormats: string[] = []

    if (state.isBold) activeFormats.push('Bold')
    if (state.isItalic) activeFormats.push('Italic')
    if (state.isUnderline) activeFormats.push('Underline')
    if (state.isStrike) activeFormats.push('Strike')
    if (state.isCode) activeFormats.push('Code')
    if (state.isHighlight) activeFormats.push('Highlight')
    if (state.isLink) activeFormats.push('Link')
    if (state.isBulletList) activeFormats.push('Bullet List')
    if (state.isOrderedList) activeFormats.push('Ordered List')
    if (state.isBlockquote) activeFormats.push('Blockquote')
    if (state.headingLevel > 0) activeFormats.push(`Heading ${state.headingLevel}`)

    const summary = [
        `Font: ${getFontFamilyDisplayName(state.fontFamily)} ${state.fontSize}px`,
        `Align: ${getTextAlignDisplayName(state.textAlign)}`,
        `Selection: ${state.hasSelection ? `"${state.selectionText}"` : 'None'}`,
        `Formats: ${activeFormats.length > 0 ? activeFormats.join(', ') : 'None'}`,
        `Dirty: ${state.isDirty}`,
        `Can Undo: ${state.canUndo}`,
        `Can Redo: ${state.canRedo}`,
    ]

    return summary.join(' | ')
}

/**
 * Compares two editor states and returns the differences
 */
export function getEditorStateDiff(oldState: EditorState, newState: EditorState): Partial<EditorState> {
    const diff: Partial<EditorState> = {}

    if (oldState.isBold !== newState.isBold) diff.isBold = newState.isBold
    if (oldState.isItalic !== newState.isItalic) diff.isItalic = newState.isItalic
    if (oldState.isUnderline !== newState.isUnderline) diff.isUnderline = newState.isUnderline
    if (oldState.isStrike !== newState.isStrike) diff.isStrike = newState.isStrike
    if (oldState.isCode !== newState.isCode) diff.isCode = newState.isCode
    if (oldState.isHighlight !== newState.isHighlight) diff.isHighlight = newState.isHighlight
    if (oldState.textAlign !== newState.textAlign) diff.textAlign = newState.textAlign
    if (oldState.isLink !== newState.isLink) diff.isLink = newState.isLink
    if (oldState.isBulletList !== newState.isBulletList) diff.isBulletList = newState.isBulletList
    if (oldState.isOrderedList !== newState.isOrderedList) diff.isOrderedList = newState.isOrderedList
    if (oldState.isBlockquote !== newState.isBlockquote) diff.isBlockquote = newState.isBlockquote
    if (oldState.headingLevel !== newState.headingLevel) diff.headingLevel = newState.headingLevel
    if (oldState.fontSize !== newState.fontSize) diff.fontSize = newState.fontSize
    if (oldState.fontFamily !== newState.fontFamily) diff.fontFamily = newState.fontFamily
    if (oldState.content !== newState.content) diff.content = newState.content
    if (oldState.hasSelection !== newState.hasSelection) diff.hasSelection = newState.hasSelection
    if (oldState.selectionText !== newState.selectionText) diff.selectionText = newState.selectionText
    if (oldState.canUndo !== newState.canUndo) diff.canUndo = newState.canUndo
    if (oldState.canRedo !== newState.canRedo) diff.canRedo = newState.canRedo
    if (oldState.isDirty !== newState.isDirty) diff.isDirty = newState.isDirty
    if (oldState.isSaving !== newState.isSaving) diff.isSaving = newState.isSaving

    return diff
}

/**
 * Creates a clean copy of editor state without sensitive or temporary data
 */
// export function createCleanEditorState(state: EditorState): Partial<EditorState> {
//     const {
//         contextBubble,
//         selectionRect,
//         hasSelection,
//         selectionText,
//         isSaving,
//         ...cleanState
//     } = state

//     return cleanState
// }

/**
 * Validates if an editor state object is complete and valid
 */
export function validateEditorState(state: Partial<EditorState>): boolean {
    // Check required fields
    const requiredFields: (keyof EditorState)[] = [
        'isBold', 'isItalic', 'isUnderline', 'isStrike', 'isCode', 'isHighlight',
        'textAlign', 'isLink', 'isBulletList', 'isOrderedList', 'isBlockquote',
        'headingLevel', 'fontSize', 'fontFamily', 'content', 'hasSelection',
        'selectionText', 'contextBubble', 'selectionRect', 'canUndo', 'canRedo',
        'isDirty', 'isSaving'
    ]

    for (const field of requiredFields) {
        if (!(field in state)) {
            return false
        }
    }

    // Validate specific fields
    if (state.fontSize && !isValidFontSize(state.fontSize)) {
        return false
    }

    if (state.headingLevel && !isValidHeadingLevel(state.headingLevel)) {
        return false
    }

    if (state.textAlign && !['left', 'center', 'right', 'justify'].includes(state.textAlign)) {
        return false
    }

    return true
} 