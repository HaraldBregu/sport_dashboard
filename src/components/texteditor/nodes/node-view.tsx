
import { NodeViewContent, NodeViewWrapper } from '@tiptap/react'
import { MoreVertical, Copy, Edit, Trash } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function NodeView() {
  return (
    <NodeViewWrapper className="draggable-item flex items-center gap-2">
      <NodeViewContent className="content flex-1" />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button 
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-sm transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreVertical className="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={(e) => {
            e.stopPropagation();
            console.log('Edit clicked');
          }}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={(e) => {
            e.stopPropagation();
            console.log('Duplicate clicked');
          }}>
            <Copy className="h-4 w-4 mr-2" />
            Duplicate
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            className="text-destructive focus:bg-destructive focus:text-destructive-foreground"
            onClick={(e) => {
              e.stopPropagation();
              console.log('Delete clicked');
            }}
          >
            <Trash className="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </NodeViewWrapper>
  )
}
