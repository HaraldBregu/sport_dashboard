import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage
} from '@/components/ui/breadcrumb'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SidebarTrigger } from '@/components/ui/sidebar'
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Code,
  Link,
  Image,
  Table,
  Eye,
  Settings,
  MoreHorizontal,
  MessageCirclePlus,
  Bookmark,
  Minus
} from 'lucide-react'
import { memo, useCallback } from 'react'
import { useEditor } from './context'

interface HeaderProps {
  className?: string
  onSetBold: () => void
  onSetImage: () => void
  onSetComment: () => void
  onSetBookmark: () => void
  onSetHorizontalRule: () => void
}

const Header = ({ className, onSetBold, onSetImage, onSetComment, onSetBookmark, onSetHorizontalRule }: HeaderProps) => {
  const { state, setItalic, setUnderline, setStrike, setCode, setTextAlign, setLink, setBulletList, setOrderedList, setBlockquote, setHeadingLevel, setFontSize, setFontFamily } = useEditor()
  const { isBold, isItalic, isUnderline, isStrike, isCode, textAlign, isLink, isBulletList, isOrderedList, isBlockquote, headingLevel, fontSize, fontFamily } = state

  const handleSetPreview = useCallback((value: boolean) => {
    console.log(value)
  }, [])

  const handleSetImage = useCallback(() => {
    onSetImage()
  }, [onSetImage])

  const handleSetTable = useCallback((value: boolean) => {
    console.log(value)
  }, [])

  const handleSetComment = useCallback(() => {
    onSetComment()
  }, [onSetComment])

  const handleSetBookmark = useCallback(() => {
    onSetBookmark()
  }, [onSetBookmark])

  const handleSetHorizontalRule = useCallback(() => {
    onSetHorizontalRule()
  }, [onSetHorizontalRule])

  return (
    <header
      className={cn('bg-background dark:bg-background border-b border-gray-200 dark:border-gray-600', className)}
    >
      {/* Top section with breadcrumb */}
      <div className="flex h-14 items-center gap-2 px-3">
        <SidebarTriggerMemo />
        <BreadcrumbMemo />
      </div>

      {/* Bottom section with toolbar */}
      <TooltipProviderMemo>
        <div className={cn('bg-background dark:bg-background flex items-center gap-1 px-3 py-2', className)}>
          {/* File Operations */}
          {/* <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" disabled={isSaving}>
                  <Save className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Save (Ctrl+S)</TooltipContent>
            </Tooltip>
            <Separator orientation="vertical" className="h-6" />
          </div> */}

          {/* Undo/Redo */}
          {/* <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" disabled={!canUndo}>
                  <Undo className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" disabled={!canRedo}>
                  <Redo className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Redo (Ctrl+Y)</TooltipContent>
            </Tooltip>
            <Separator orientation="vertical" className="h-6" />
          </div> */}

          {/* Heading/Body Selector */}
          <div className="flex items-center gap-1">
            <HeadingLevelSelect
              headingLevel={headingLevel}
              setHeadingLevel={setHeadingLevel}
            />
            <SeparatorMemo />
          </div>

          {/* Font Family Selector */}
          <div className="flex items-center gap-1">
            <FontFamilySelect
              fontFamily={fontFamily}
              setFontFamily={setFontFamily}
            />
            <SeparatorMemo />
          </div>

          {/* Font Size Selector */}
          <div className="flex items-center gap-1">
            <FontSizeSelect
              fontSize={fontSize}
              setFontSize={setFontSize}
            />
            <SeparatorMemo />
          </div>

          {/* Text Formatting */}
          <div className="flex items-center gap-1">
            <TextFormatting
              isBold={isBold}
              setBold={onSetBold}
              isItalic={isItalic}
              setItalic={setItalic}
              isUnderline={isUnderline}
              setUnderline={setUnderline}
              isStrike={isStrike}
              setStrike={setStrike}
            />
            <SeparatorMemo />
          </div>

          {/* Text Alignment */}
          <div className="flex items-center gap-1">
            <TextAlignment
              textAlign={textAlign}
              setTextAlign={setTextAlign}
            />
            <SeparatorMemo />
          </div>

          {/* Lists and Formatting */}
          <div className="flex items-center gap-1">
            <ListFormatting
              isBulletList={isBulletList}
              setBulletList={setBulletList}
              isOrderedList={isOrderedList}
              setOrderedList={setOrderedList}
              isBlockquote={isBlockquote}
              setBlockquote={setBlockquote}
              isCode={isCode}
              setCode={setCode}
            />
            <SeparatorMemo />
          </div>

          {/* Insert Options */}
          <div className="flex items-center gap-1">
            <InsertOptions
              isLink={isLink}
              setLink={setLink}
              isImage={false}
              setImage={handleSetImage}
              isTable={false}
              setTable={handleSetTable}
              setComment={handleSetComment}
              setBookmark={handleSetBookmark}
              setHorizontalRule={handleSetHorizontalRule}
            />
            <SeparatorMemo />
          </div>

          {/* View Options */}
          <div className="flex items-center gap-1">
            <ViewOptions
              isPreview={false}
              setPreview={handleSetPreview}
            />
            <SeparatorMemo />
          </div>

          {/* Status and Settings */}
          <div className="ml-auto flex items-center gap-2">
            <StatusSettings />
          </div>

        </div>
      </TooltipProviderMemo>
    </header>
  )
}

Header.displayName = 'Header'

export default memo(Header)

const SidebarTriggerMemo = memo(({ ...props }: React.ComponentProps<typeof SidebarTrigger>) => {
  return (
    <SidebarTrigger {...props} />
  )
})

const HeadingLevelSelect = memo(({ headingLevel, setHeadingLevel }: { headingLevel: 0 | 1 | 2 | 3 | 4 | 5 | 6, setHeadingLevel: (headingLevel: 0 | 1 | 2 | 3 | 4 | 5 | 6) => void }) => {
  return (
    <TooltipMemo>
      <Select value={headingLevel === 0 ? "body" : `h${headingLevel}`} onValueChange={(value) => {
        if (value === "body") {
          setHeadingLevel(0)
        } else {
          setHeadingLevel(parseInt(value.slice(1)) as 1 | 2 | 3 | 4 | 5 | 6)
        }
      }}>
        <TooltipTriggerMemo asChild>
          <SelectTrigger className="w-[120px] h-8">
            <SelectValue placeholder="Text style" />
          </SelectTrigger>
        </TooltipTriggerMemo>
        <SelectContent>
          <SelectItem value="h1">Heading 1</SelectItem>
          <SelectItem value="h2">Heading 2</SelectItem>
          <SelectItem value="h3">Heading 3</SelectItem>
          <SelectItem value="h4">Heading 4</SelectItem>
          <SelectItem value="h5">Heading 5</SelectItem>
          <SelectItem value="h6">Heading 6</SelectItem>
          <SelectItem value="body">Body Text</SelectItem>
        </SelectContent>
      </Select>
      <TooltipContentMemo>Text Style</TooltipContentMemo>
    </TooltipMemo>
  )
})

const FontFamilySelect = memo(({ fontFamily, setFontFamily }: { fontFamily: string, setFontFamily: (fontFamily: string) => void }) => {
  return (
    <TooltipMemo>
      <Select value={fontFamily} onValueChange={setFontFamily}>
        <TooltipTriggerMemo asChild>
          <SelectTrigger className="w-[120px] h-8">
            <SelectValue placeholder="Font" />
          </SelectTrigger>
        </TooltipTriggerMemo>
        <SelectContent>
          <SelectItem value="inter">Inter</SelectItem>
          <SelectItem value="arial">Arial</SelectItem>
          <SelectItem value="times">Times New Roman</SelectItem>
          <SelectItem value="georgia">Georgia</SelectItem>
          <SelectItem value="verdana">Verdana</SelectItem>
          <SelectItem value="helvetica">Helvetica</SelectItem>
          <SelectItem value="courier">Courier New</SelectItem>
          <SelectItem value="monaco">Monaco</SelectItem>
        </SelectContent>
      </Select>
      <TooltipContentMemo>Font Family</TooltipContentMemo>
    </TooltipMemo>
  )
})

const FontSizeSelect = memo(({ fontSize, setFontSize }: { fontSize: number, setFontSize: (fontSize: number) => void }) => {
  return (
    <TooltipMemo>
      <Select value={fontSize.toString()} onValueChange={(value) => setFontSize(parseInt(value))}>
        <TooltipTriggerMemo asChild>
          <SelectTrigger className="w-[80px] h-8">
            <SelectValue placeholder="Size" />
          </SelectTrigger>
        </TooltipTriggerMemo  >
        <SelectContent>
          <SelectItem value="8">8px</SelectItem>
          <SelectItem value="10">10px</SelectItem>
          <SelectItem value="12">12px</SelectItem>
          <SelectItem value="14">14px</SelectItem>
          <SelectItem value="16">16px</SelectItem>
          <SelectItem value="18">18px</SelectItem>
          <SelectItem value="20">20px</SelectItem>
          <SelectItem value="24">24px</SelectItem>
          <SelectItem value="28">28px</SelectItem>
          <SelectItem value="32">32px</SelectItem>
          <SelectItem value="36">36px</SelectItem>
          <SelectItem value="48">48px</SelectItem>
          <SelectItem value="64">64px</SelectItem>
          <SelectItem value="72">72px</SelectItem>
        </SelectContent>
      </Select>
      <TooltipContentMemo>Font Size</TooltipContentMemo>
    </TooltipMemo>
  )
})

const TextFormatting = memo(({ isBold, setBold, isItalic, setItalic, isUnderline, setUnderline, isStrike, setStrike }: { isBold: boolean, setBold: (isBold: boolean) => void, isItalic: boolean, setItalic: (isItalic: boolean) => void, isUnderline: boolean, setUnderline: (isUnderline: boolean) => void, isStrike: boolean, setStrike: (isStrike: boolean) => void }) => {
  console.log("TextFormatting rendered")
  return (
    <ToggleGroup type="multiple" size="sm" value={[
      isBold ? 'bold' : '',
      isItalic ? 'italic' : '',
      isUnderline ? 'underline' : '',
      isStrike ? 'strikethrough' : ''
    ].filter(Boolean)}>
      <TooltipMemo>
        <TooltipTriggerMemo asChild>
          <ToggleGroupItem
            value="bold"
            variant={isBold ? 'default' : 'outline'}
            aria-label="Toggle bold"
            onClick={() => setBold(!isBold)}
          >
            <Bold className="h-4 w-4" />
          </ToggleGroupItem>
        </TooltipTriggerMemo>
        <TooltipContentMemo>Bold (Ctrl+B)</TooltipContentMemo>
      </TooltipMemo>

      <TooltipMemo>
        <TooltipTriggerMemo asChild>
          <ToggleGroupItem
            value="italic"
            variant={isItalic ? 'default' : 'outline'}
            aria-label="Toggle italic"
            onClick={() => setItalic(!isItalic)}
          >
            <Italic className="h-4 w-4" />
          </ToggleGroupItem>
        </TooltipTriggerMemo>
        <TooltipContentMemo>Italic (Ctrl+I)</TooltipContentMemo>
      </TooltipMemo>

      <TooltipMemo>
        <TooltipTriggerMemo asChild>
          <ToggleGroupItem
            value="underline"
            variant={isUnderline ? 'default' : 'outline'}
            aria-label="Toggle underline"
            onClick={() => setUnderline(!isUnderline)}
          >
            <Underline className="h-4 w-4" />
          </ToggleGroupItem>
        </TooltipTriggerMemo>
        <TooltipContentMemo>Underline (Ctrl+U)</TooltipContentMemo>
      </TooltipMemo>

      <TooltipMemo>
        <TooltipTriggerMemo asChild>
          <ToggleGroupItem
            value="strikethrough"
            variant={isStrike ? 'default' : 'outline'}
            aria-label="Toggle strikethrough"
            onClick={() => setStrike(!isStrike)}
          >
            <Strikethrough className="h-4 w-4" />
          </ToggleGroupItem>
        </TooltipTriggerMemo>
        <TooltipContentMemo>Strikethrough</TooltipContentMemo>
      </TooltipMemo>
    </ToggleGroup>
  )
})

const TextAlignment = memo(({ textAlign, setTextAlign }: { textAlign: 'left' | 'center' | 'right' | 'justify', setTextAlign: (textAlign: 'left' | 'center' | 'right' | 'justify') => void }) => {
  return (
    <ToggleGroup type="single" size="sm" value={textAlign}>
      <TooltipMemo>
        <TooltipTriggerMemo asChild>
          <ToggleGroupItem
            value="left"
            aria-label="Align left"
            onClick={() => setTextAlign('left')}
          >
            <AlignLeft className="h-4 w-4" />
          </ToggleGroupItem>
        </TooltipTriggerMemo>
        <TooltipContentMemo>Align Left</TooltipContentMemo>
      </TooltipMemo>

      <TooltipMemo>
        <TooltipTriggerMemo asChild>
          <ToggleGroupItem
            value="center"
            aria-label="Align center"
            onClick={() => setTextAlign('center')}
          >
            <AlignCenter className="h-4 w-4" />
          </ToggleGroupItem>
        </TooltipTriggerMemo>
        <TooltipContentMemo>Align Center</TooltipContentMemo>
      </TooltipMemo>

      <TooltipMemo>
        <TooltipTriggerMemo asChild>
          <ToggleGroupItem
            value="right"
            aria-label="Align right"
            onClick={() => setTextAlign('right')}
          >
            <AlignRight className="h-4 w-4" />
          </ToggleGroupItem>
        </TooltipTriggerMemo>
        <TooltipContentMemo>Align Right</TooltipContentMemo>
      </TooltipMemo>

      <TooltipMemo>
        <TooltipTriggerMemo asChild>
          <ToggleGroupItem
            value="justify"
            aria-label="Align justify"
            onClick={() => setTextAlign('justify')}
          >
            <AlignJustify className="h-4 w-4" />
          </ToggleGroupItem>
        </TooltipTriggerMemo>
        <TooltipContentMemo>Justify</TooltipContentMemo>
      </TooltipMemo>
    </ToggleGroup>
  )
})

const ListFormatting = memo(({
  isBulletList,
  setBulletList,
  isOrderedList,
  setOrderedList,
  isBlockquote,
  setBlockquote,
  isCode,
  setCode
}: { isBulletList: boolean, setBulletList: (isBulletList: boolean) => void, isOrderedList: boolean, setOrderedList: (isOrderedList: boolean) => void, isBlockquote: boolean, setBlockquote: (isBlockquote: boolean) => void, isCode: boolean, setCode: (isCode: boolean) => void }) => {

  return (
    <>
      <TooltipMemo>
        <TooltipTriggerMemo asChild>
          <Button
            variant={isBulletList ? "default" : "ghost"}
            size="sm"
            onClick={() => setBulletList(!isBulletList)}
          >
            <List className="h-4 w-4" />
          </Button>
        </TooltipTriggerMemo>
        <TooltipContentMemo>Bullet List</TooltipContentMemo>
      </TooltipMemo>

      <TooltipMemo>
        <TooltipTriggerMemo asChild>
          <Button
            variant={isOrderedList ? "default" : "ghost"}
            size="sm"
            onClick={() => setOrderedList(!isOrderedList)}
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
        </TooltipTriggerMemo>
        <TooltipContentMemo>Numbered List</TooltipContentMemo >
      </TooltipMemo>

      <TooltipMemo>
        <TooltipTriggerMemo asChild>
          <Button
            variant={isBlockquote ? "default" : "ghost"}
            size="sm"
            onClick={() => setBlockquote(!isBlockquote)}
          >
            <Quote className="h-4 w-4" />
          </Button>
        </TooltipTriggerMemo  >
        <TooltipContentMemo>Blockquote</TooltipContentMemo>
      </TooltipMemo>

      <TooltipMemo>
        <TooltipTriggerMemo asChild>
          <Button
            variant={isCode ? "default" : "ghost"}
            size="sm"
            onClick={() => setCode(!isCode)}
          >
            <Code className="h-4 w-4" />
          </Button>
        </TooltipTriggerMemo>
        <TooltipContentMemo>Code Block</TooltipContentMemo>
      </TooltipMemo>

    </>
  )
})

const InsertOptions = memo(({
  isLink,
  setLink,
  isImage,
  setImage,
  isTable,
  setTable,
  setComment,
  setBookmark,
  setHorizontalRule,
}: {
  isLink: boolean,
  setLink: (isLink: boolean) => void,
  isImage: boolean,
  setImage: (isImage: boolean) => void,
  isTable: boolean,
  setTable: (isTable: boolean) => void,
  setComment: () => void,
  setBookmark: () => void,
  setHorizontalRule: () => void
}) => (
  <>
    <TooltipMemo>
      <TooltipTriggerMemo asChild>
        <Button
          variant={isLink ? "default" : "ghost"}
          size="sm"
          onClick={() => setLink(!isLink)}
        >
          <Link className="h-4 w-4" />
        </Button>
      </TooltipTriggerMemo>
      <TooltipContentMemo>Insert Link</TooltipContentMemo>
    </TooltipMemo>

    <TooltipMemo>
      <TooltipTriggerMemo asChild>
        <Button
          variant={isImage ? "default" : "ghost"}
          size="sm"
          onClick={() => setImage(!isImage)}>
          <Image className="h-4 w-4" />
        </Button>
      </TooltipTriggerMemo>
      <TooltipContentMemo>Insert Image</TooltipContentMemo>
    </TooltipMemo>

    <TooltipMemo>
      <TooltipTriggerMemo asChild>
        <Button variant={isTable ? "default" : "ghost"} size="sm" onClick={() => setTable(!isTable)}>
          <Table className="h-4 w-4" />
        </Button>
      </TooltipTriggerMemo>
      <TooltipContentMemo>Insert Table</TooltipContentMemo>
    </TooltipMemo>

    <TooltipMemo>
      <TooltipTriggerMemo asChild>
        <Button
          variant="ghost"
          size="sm"
          onClick={setComment}>
          <MessageCirclePlus className="h-4 w-4" />
        </Button>
      </TooltipTriggerMemo>
      <TooltipContentMemo>Insert Comment</TooltipContentMemo>
    </TooltipMemo>

    <TooltipMemo>
      <TooltipTriggerMemo asChild>
        <Button variant="ghost" size="sm" onClick={setBookmark}>
          <Bookmark className="h-4 w-4" />
        </Button>
      </TooltipTriggerMemo>
      <TooltipContentMemo>Insert Bookmark</TooltipContentMemo>
    </TooltipMemo>

    <TooltipMemo>
      <TooltipTriggerMemo asChild>
        <Button variant="ghost" size="sm" onClick={setHorizontalRule}>
          <Minus className="h-4 w-4" />
        </Button>
      </TooltipTriggerMemo>
      <TooltipContentMemo>Insert Horizontal Rule</TooltipContentMemo>
    </TooltipMemo>

  </>
))

const ViewOptions = memo(({ isPreview, setPreview }: { isPreview: boolean, setPreview: (isPreview: boolean) => void }) => {
  return (
    <>
      <TooltipMemo>
        <TooltipTriggerMemo asChild>
          <Button variant={isPreview ? "default" : "ghost"}
            size="sm"
            onClick={() => setPreview(!isPreview)}>
            <Eye className="h-4 w-4" />
          </Button>
        </TooltipTriggerMemo>
        <TooltipContentMemo>Preview</TooltipContentMemo>
      </TooltipMemo>
    </>
  )
})

const StatusSettings = memo(() => {
  return (
    <>
      <Badge variant="secondary" className="text-xs">
        Auto-saved
      </Badge>

      <TooltipMemo>
        <TooltipTriggerMemo asChild>
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </TooltipTriggerMemo>
        <TooltipContentMemo>Editor Settings</TooltipContentMemo >
      </TooltipMemo>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Export as PDF</DropdownMenuItem>
          <DropdownMenuItem>Export as Word</DropdownMenuItem>
          <DropdownMenuItem>Print</DropdownMenuItem>
          <DropdownMenuItem>Share</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
})

const BreadcrumbMemo = memo(() => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbPage className="line-clamp-1 text-xl font-black">Tiptap Editor</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
})

const SeparatorMemo = memo(() => {
  return (
    <Separator orientation="vertical" className="h-6" />
  )
})

const TooltipProviderMemo = memo(({ ...props }: React.ComponentProps<typeof TooltipProvider>) => {
  return (
    <TooltipProvider {...props} />
  )
})

const TooltipMemo = memo(({ ...props }: React.ComponentProps<typeof Tooltip>) => {
  return (
    <Tooltip {...props} />
  )
})

const TooltipContentMemo = memo(({ ...props }: React.ComponentProps<typeof TooltipContent>) => {
  return (
    <TooltipContent {...props} />
  )
})

const TooltipTriggerMemo = memo(({ ...props }: React.ComponentProps<typeof TooltipTrigger>) => {
  return (
    <TooltipTrigger {...props} />
  )
})