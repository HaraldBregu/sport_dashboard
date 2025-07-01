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
  Undo,
  Redo,
  Save,
  Eye,
  Settings,
  MoreHorizontal
} from 'lucide-react'
import { memo } from 'react'
import { useEditor } from './context'

interface HeaderProps {
  className?: string
}

const Header = ({ className }: HeaderProps) => {
  const { state, setBold, setItalic, setUnderline, setStrike, setCode, setTextAlign, setLink, setBulletList, setOrderedList, setBlockquote, setHeadingLevel, setFontSize, setFontFamily } = useEditor()
  const { isBold, isItalic, isUnderline, isStrike, isCode, textAlign, isLink, isBulletList, isOrderedList, isBlockquote, headingLevel, fontSize, fontFamily, canUndo, canRedo, isSaving } = state


  return (
    <header
      className={cn('bg-background dark:bg-background border-b border-gray-200 dark:border-gray-600', className)}
    >
      {/* Top section with breadcrumb */}
      <div className="flex h-14 items-center gap-2 px-3">
        <SidebarTrigger />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage className="line-clamp-1 text-xl font-black">Tiptap Editor</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Bottom section with toolbar */}
      <TooltipProvider>
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
            <HeadingLevelSelect headingLevel={headingLevel} setHeadingLevel={setHeadingLevel} />
            <Separator orientation="vertical" className="h-6" />
          </div>

          {/* Font Family Selector */}
          <div className="flex items-center gap-1">
            <FontFamilySelect fontFamily={fontFamily} setFontFamily={setFontFamily} />
            <Separator orientation="vertical" className="h-6" />
          </div>

          {/* Font Size Selector */}
          <div className="flex items-center gap-1">
            <FontSizeSelect fontSize={fontSize} setFontSize={setFontSize} />
            <Separator orientation="vertical" className="h-6" />
          </div>

          {/* Text Formatting */}
          <div className="flex items-center gap-1">
            <TextFormatting isBold={isBold} setBold={setBold} isItalic={isItalic} setItalic={setItalic} isUnderline={isUnderline} setUnderline={setUnderline} isStrike={isStrike} setStrike={setStrike} />
            <Separator orientation="vertical" className="h-6" />
          </div>

          {/* Text Alignment */}
          {/* <div className="flex items-center gap-1">
            <ToggleGroup type="single" size="sm" value={textAlign}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <ToggleGroupItem
                    value="left"
                    aria-label="Align left"
                    onClick={() => setTextAlign('left')}
                  >
                    <AlignLeft className="h-4 w-4" />
                  </ToggleGroupItem>
                </TooltipTrigger>
                <TooltipContent>Align Left</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <ToggleGroupItem
                    value="center"
                    aria-label="Align center"
                    onClick={() => setTextAlign('center')}
                  >
                    <AlignCenter className="h-4 w-4" />
                  </ToggleGroupItem>
                </TooltipTrigger>
                <TooltipContent>Align Center</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <ToggleGroupItem
                    value="right"
                    aria-label="Align right"
                    onClick={() => setTextAlign('right')}
                  >
                    <AlignRight className="h-4 w-4" />
                  </ToggleGroupItem>
                </TooltipTrigger>
                <TooltipContent>Align Right</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <ToggleGroupItem
                    value="justify"
                    aria-label="Align justify"
                    onClick={() => setTextAlign('justify')}
                  >
                    <AlignJustify className="h-4 w-4" />
                  </ToggleGroupItem>
                </TooltipTrigger>
                <TooltipContent>Justify</TooltipContent>
              </Tooltip>
            </ToggleGroup>

            <Separator orientation="vertical" className="h-6" />
          </div> */}

          {/* Lists and Formatting */}
          {/* <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={isBulletList ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setBulletList(!isBulletList)}
                >
                  <List className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Bullet List</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={isOrderedList ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setOrderedList(!isOrderedList)}
                >
                  <ListOrdered className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Numbered List</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={isBlockquote ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setBlockquote(!isBlockquote)}
                >
                  <Quote className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Blockquote</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={isCode ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCode(!isCode)}
                >
                  <Code className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Code Block</TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="h-6" />
          </div> */}

          {/* Insert Options */}
          {/* <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={isLink ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setLink(!isLink)}
                >
                  <Link className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Insert Link</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Image className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Insert Image</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Table className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Insert Table</TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="h-6" />
          </div> */}

          {/* View Options */}
          {/* <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Preview</TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="h-6" />
          </div> */}

          {/* Status and Settings */}
          {/* <div className="ml-auto flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              Auto-saved
            </Badge>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Editor Settings</TooltipContent>
            </Tooltip>

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
          </div> */}
        </div>
      </TooltipProvider>
    </header>
  )
  return (
    <header
      className={cn('bg-background dark:bg-background border-b border-gray-200 dark:border-gray-600', className)}
    >
      {/* Top section with breadcrumb */}
      <div className="flex h-14 items-center gap-2 px-3">
        <SidebarTrigger />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage className="line-clamp-1 text-xl font-black">Tiptap Editor</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Bottom section with toolbar */}
      <TooltipProvider>
        <div className={cn('bg-background dark:bg-background flex items-center gap-1 px-3 py-2', className)}>
          {/* File Operations */}
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" disabled={isSaving}>
                  <Save className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Save (Ctrl+S)</TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="h-6" />
          </div>

          {/* Undo/Redo */}
          <div className="flex items-center gap-1">
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
          </div>

          {/* Heading/Body Selector */}
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Select value={headingLevel === 0 ? "body" : `h${headingLevel}`} onValueChange={(value) => {
                  if (value === "body") {
                    setHeadingLevel(0)
                  } else {
                    setHeadingLevel(parseInt(value.slice(1)) as 1 | 2 | 3 | 4 | 5 | 6)
                  }
                }}>
                  <SelectTrigger className="w-[120px] h-8">
                    <SelectValue placeholder="Text style" />
                  </SelectTrigger>
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
              </TooltipTrigger>
              <TooltipContent>Text Style</TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="h-6" />
          </div>

          {/* Font Family Selector */}
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Select value={fontFamily} onValueChange={setFontFamily}>
                  <SelectTrigger className="w-[120px] h-8">
                    <SelectValue placeholder="Font" />
                  </SelectTrigger>
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
              </TooltipTrigger>
              <TooltipContent>Font Family</TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="h-6" />
          </div>

          {/* Font Size Selector */}
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Select value={fontSize.toString()} onValueChange={(value) => setFontSize(parseInt(value))}>
                  <SelectTrigger className="w-[80px] h-8">
                    <SelectValue placeholder="Size" />
                  </SelectTrigger>
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
              </TooltipTrigger>
              <TooltipContent>Font Size</TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="h-6" />
          </div>

          {/* Text Formatting */}
          <div className="flex items-center gap-1">
            <ToggleGroup type="multiple" size="sm" value={[
              isBold ? 'bold' : '',
              isItalic ? 'italic' : '',
              isUnderline ? 'underline' : '',
              isStrike ? 'strikethrough' : ''
            ].filter(Boolean)}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <ToggleGroupItem
                    value="bold"
                    variant={isBold ? 'default' : 'outline'}
                    aria-label="Toggle bold"
                    onClick={() => setBold(!isBold)}
                  >
                    <Bold className="h-4 w-4" />
                  </ToggleGroupItem>
                </TooltipTrigger>
                <TooltipContent>Bold (Ctrl+B)</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <ToggleGroupItem
                    value="italic"
                    variant={isItalic ? 'default' : 'outline'}
                    aria-label="Toggle italic"
                    onClick={() => setItalic(!isItalic)}
                  >
                    <Italic className="h-4 w-4" />
                  </ToggleGroupItem>
                </TooltipTrigger>
                <TooltipContent>Italic (Ctrl+I)</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <ToggleGroupItem
                    value="underline"
                    variant={isUnderline ? 'default' : 'outline'}
                    aria-label="Toggle underline"
                    onClick={() => setUnderline(!isUnderline)}
                  >
                    <Underline className="h-4 w-4" />
                  </ToggleGroupItem>
                </TooltipTrigger>
                <TooltipContent>Underline (Ctrl+U)</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <ToggleGroupItem
                    value="strikethrough"
                    variant={isStrike ? 'default' : 'outline'}
                    aria-label="Toggle strikethrough"
                    onClick={() => setStrike(!isStrike)}
                  >
                    <Strikethrough className="h-4 w-4" />
                  </ToggleGroupItem>
                </TooltipTrigger>
                <TooltipContent>Strikethrough</TooltipContent>
              </Tooltip>
            </ToggleGroup>

            <Separator orientation="vertical" className="h-6" />
          </div>

          {/* Text Alignment */}
          <div className="flex items-center gap-1">
            <ToggleGroup type="single" size="sm" value={textAlign}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <ToggleGroupItem
                    value="left"
                    aria-label="Align left"
                    onClick={() => setTextAlign('left')}
                  >
                    <AlignLeft className="h-4 w-4" />
                  </ToggleGroupItem>
                </TooltipTrigger>
                <TooltipContent>Align Left</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <ToggleGroupItem
                    value="center"
                    aria-label="Align center"
                    onClick={() => setTextAlign('center')}
                  >
                    <AlignCenter className="h-4 w-4" />
                  </ToggleGroupItem>
                </TooltipTrigger>
                <TooltipContent>Align Center</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <ToggleGroupItem
                    value="right"
                    aria-label="Align right"
                    onClick={() => setTextAlign('right')}
                  >
                    <AlignRight className="h-4 w-4" />
                  </ToggleGroupItem>
                </TooltipTrigger>
                <TooltipContent>Align Right</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <ToggleGroupItem
                    value="justify"
                    aria-label="Align justify"
                    onClick={() => setTextAlign('justify')}
                  >
                    <AlignJustify className="h-4 w-4" />
                  </ToggleGroupItem>
                </TooltipTrigger>
                <TooltipContent>Justify</TooltipContent>
              </Tooltip>
            </ToggleGroup>

            <Separator orientation="vertical" className="h-6" />
          </div>

          {/* Lists and Formatting */}
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={isBulletList ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setBulletList(!isBulletList)}
                >
                  <List className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Bullet List</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={isOrderedList ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setOrderedList(!isOrderedList)}
                >
                  <ListOrdered className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Numbered List</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={isBlockquote ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setBlockquote(!isBlockquote)}
                >
                  <Quote className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Blockquote</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={isCode ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCode(!isCode)}
                >
                  <Code className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Code Block</TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="h-6" />
          </div>

          {/* Insert Options */}
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={isLink ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setLink(!isLink)}
                >
                  <Link className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Insert Link</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Image className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Insert Image</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Table className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Insert Table</TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="h-6" />
          </div>

          {/* View Options */}
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Preview</TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="h-6" />
          </div>

          {/* Status and Settings */}
          <div className="ml-auto flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              Auto-saved
            </Badge>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Editor Settings</TooltipContent>
            </Tooltip>

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
          </div>
        </div>
      </TooltipProvider>
    </header>
  )
}

Header.displayName = 'Header'

export default memo(Header)


const HeadingLevelSelect = memo(({ headingLevel, setHeadingLevel }: { headingLevel: 0 | 1 | 2 | 3 | 4 | 5 | 6, setHeadingLevel: (headingLevel: 0 | 1 | 2 | 3 | 4 | 5 | 6) => void }) => {
  return (
    <Tooltip>
      <Select value={headingLevel === 0 ? "body" : `h${headingLevel}`} onValueChange={(value) => {
        if (value === "body") {
          setHeadingLevel(0)
        } else {
          setHeadingLevel(parseInt(value.slice(1)) as 1 | 2 | 3 | 4 | 5 | 6)
        }
      }}>
        <TooltipTrigger asChild>
          <SelectTrigger className="w-[120px] h-8">
            <SelectValue placeholder="Text style" />
          </SelectTrigger>
        </TooltipTrigger>
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
      <TooltipContent>Text Style</TooltipContent>
    </Tooltip>
  )
})

const FontFamilySelect = memo(({ fontFamily, setFontFamily }: { fontFamily: string, setFontFamily: (fontFamily: string) => void }) => {
  return (
    <Tooltip>
      <Select value={fontFamily} onValueChange={setFontFamily}>
        <TooltipTrigger asChild>
          <SelectTrigger className="w-[120px] h-8">
            <SelectValue placeholder="Font" />
          </SelectTrigger>
        </TooltipTrigger>
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
      <TooltipContent>Font Family</TooltipContent>
    </Tooltip>
  )
})

const FontSizeSelect = memo(({ fontSize, setFontSize }: { fontSize: number, setFontSize: (fontSize: number) => void }) => {
  return (
    <Tooltip>
      <Select value={fontSize.toString()} onValueChange={(value) => setFontSize(parseInt(value))}>
        <TooltipTrigger asChild>
          <SelectTrigger className="w-[80px] h-8">
            <SelectValue placeholder="Size" />
          </SelectTrigger>
        </TooltipTrigger>
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
      <TooltipContent>Font Size</TooltipContent>
    </Tooltip>
  )
})

const TextFormatting = memo(({ isBold, setBold, isItalic, setItalic, isUnderline, setUnderline, isStrike, setStrike }: { isBold: boolean, setBold: (isBold: boolean) => void, isItalic: boolean, setItalic: (isItalic: boolean) => void, isUnderline: boolean, setUnderline: (isUnderline: boolean) => void, isStrike: boolean, setStrike: (isStrike: boolean) => void }) => {
  return (
    <ToggleGroup type="multiple" size="sm" value={[
      isBold ? 'bold' : '',
      isItalic ? 'italic' : '',
      isUnderline ? 'underline' : '',
      isStrike ? 'strikethrough' : ''
    ].filter(Boolean)}>
      <Tooltip>
        <TooltipTrigger asChild>
          <ToggleGroupItem
            value="bold"
            variant={isBold ? 'default' : 'outline'}
            aria-label="Toggle bold"
            onClick={() => setBold(!isBold)}
          >
            <Bold className="h-4 w-4" />
          </ToggleGroupItem>
        </TooltipTrigger>
        <TooltipContent>Bold (Ctrl+B)</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <ToggleGroupItem
            value="italic"
            variant={isItalic ? 'default' : 'outline'}
            aria-label="Toggle italic"
            onClick={() => setItalic(!isItalic)}
          >
            <Italic className="h-4 w-4" />
          </ToggleGroupItem>
        </TooltipTrigger>
        <TooltipContent>Italic (Ctrl+I)</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <ToggleGroupItem
            value="underline"
            variant={isUnderline ? 'default' : 'outline'}
            aria-label="Toggle underline"
            onClick={() => setUnderline(!isUnderline)}
          >
            <Underline className="h-4 w-4" />
          </ToggleGroupItem>
        </TooltipTrigger>
        <TooltipContent>Underline (Ctrl+U)</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <ToggleGroupItem
            value="strikethrough"
            variant={isStrike ? 'default' : 'outline'}
            aria-label="Toggle strikethrough"
            onClick={() => setStrike(!isStrike)}
          >
            <Strikethrough className="h-4 w-4" />
          </ToggleGroupItem>
        </TooltipTrigger>
        <TooltipContent>Strikethrough</TooltipContent>
      </Tooltip>
    </ToggleGroup>
  )
})