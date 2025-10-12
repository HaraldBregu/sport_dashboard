import React, { useState, useRef, useCallback, ReactNode, useEffect, createContext, useContext, forwardRef, useImperativeHandle } from 'react';
import {
  useFloating,
  useClick,
  useDismiss,
  useRole,
  useInteractions,
  FloatingPortal,
  FloatingOverlay,
  FloatingFocusManager,
  offset,
  flip,
  shift,
} from '@floating-ui/react';
import { X } from 'lucide-react';
import { Editor } from '@tiptap/react';
import { AppNavigatableList, AppNavigatableListItem } from './app-navigatable-list';

interface AppPopupProps {
  // Core props
  children?: ReactNode;
  editor?: Editor | null;
  className?: string;
  
  // UI props
  trigger?: ReactNode;
  title?: string;
  
  // State management
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  
  // Configuration props
  initialX?: number;
  initialY?: number;
  width?: number | string;
  height?: number | string;
  modal?: boolean;
  enableKeyboardShortcut?: boolean;
  keyboardShortcut?: string;
  
  // Navigatable list props
  items?: AppNavigatableListItem[];
  onItemSelect?: (item: AppNavigatableListItem, index: number) => void;
  searchPlaceholder?: string;
  emptyMessage?: string;
  showInstructions?: boolean;
  showFooter?: boolean;
}

export interface AppPopupRef {
  show: (x?: number, y?: number) => void;
  hide: () => void;
  toggle: () => void;
  isOpen: () => boolean;
}

interface AppPopupContextValue {
  editor: Editor | null;
  savedSelection: { from: number; to: number } | null;
  closePopup: () => void;
}

const AppPopupContext = createContext<AppPopupContextValue | null>(null);

export function useAppPopupContext() {
  const context = useContext(AppPopupContext);
  if (!context) {
    throw new Error('useAppPopupContext must be used within AppPopup');
  }
  return context;
}

export const AppPopup = forwardRef<AppPopupRef, AppPopupProps>(({
  // Core props
  children,
  editor,
  className,
  // UI props
  trigger,
  title = 'Popup',
  // State management
  open: controlledOpen,
  onOpenChange,
  // Configuration props
  initialX = 100,
  initialY = 100,
  width = 400,
  height = 'auto',
  modal = false,
  enableKeyboardShortcut = false,
  keyboardShortcut = 'd',
  // Navigatable list props
  items,
  onItemSelect,
  searchPlaceholder = 'Search...',
  emptyMessage = 'No items found',
  showInstructions = true,
  showFooter = true,
}, ref) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  
  // Track mouse position for popup positioning when triggered by keyboard
  const lastMousePosition = useRef({ x: initialX, y: initialY });
  
  // Store editor selection state to preserve it when popup opens
  const savedSelection = useRef<{ from: number; to: number } | null>(null);
  
  // Track selected item for navigatable list
  const [selectedItem, setSelectedItem] = useState<AppNavigatableListItem | null>(null);

  const setOpen = useCallback(
    (value: boolean) => {
      // Save selection before opening popup
      if (value && editor) {
        const { from, to } = editor.state.selection;
        savedSelection.current = { from, to };
      }
      
      if (isControlled) {
        onOpenChange?.(value);
      } else {
        setUncontrolledOpen(value);
      }
      
      // Reset saved selection and selected item when closing
      if (!value) {
        savedSelection.current = null;
        setSelectedItem(null);
      }
    },
    [isControlled, onOpenChange, editor]
  );

  // Handle item selection from navigatable list
  const handleItemSelect = useCallback((item: AppNavigatableListItem, index: number) => {
    setSelectedItem(item);
    
    if (onItemSelect) {
      onItemSelect(item, index);
    }
    
    // Close popup after selection
    setOpen(false);
  }, [onItemSelect, setOpen]);

  const { refs, context } = useFloating({
    open,
    onOpenChange: setOpen,
    middleware: [offset(10), flip(), shift()],
  });

  const click = useClick(context);
  const dismiss = useDismiss(context, {
    outsidePressEvent: 'mousedown',
  });
  const role = useRole(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    role,
  ]);

  // Dragging state
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const popupRef = useRef<HTMLDivElement>(null);
  const isInitialPositioning = useRef(true);
  const keyboardTriggered = useRef(false);

  // Helper function to intelligently position popup relative to mouse/initial position
  const getSmartPosition = useCallback((mouseX: number, mouseY: number, popupWidth?: number, popupHeight?: number) => {
    const actualWidth = popupWidth || popupRef.current?.offsetWidth || (typeof width === 'number' ? width : 400);
    const actualHeight = popupHeight || popupRef.current?.offsetHeight || (typeof height === 'number' ? height : 300);
    
    const offset = 10; // Offset from mouse cursor
    let x = mouseX + offset; // Default: to the right of cursor
    let y = mouseY - (actualHeight / 2); // Default: centered vertically

    // Vertical positioning - try to center, then adjust if needed
    const topSpace = mouseY;
    const bottomSpace = window.innerHeight - mouseY;
    const halfHeight = actualHeight / 2;

    if (topSpace >= halfHeight && bottomSpace >= halfHeight) {
      // Enough space to center vertically
      y = mouseY - halfHeight;
    } else if (bottomSpace >= actualHeight) {
      // Not enough to center, but fits below
      y = mouseY + offset;
    } else if (topSpace >= actualHeight) {
      // Not enough below, but fits above
      y = mouseY - actualHeight - offset;
    } else {
      // Doesn't fit well either way, center in viewport
      y = (window.innerHeight - actualHeight) / 2;
    }

    // Horizontal positioning
    if (x + actualWidth > window.innerWidth) {
      // Position to the left of cursor instead
      x = mouseX - actualWidth - offset;
      
      // If it still doesn't fit, center horizontally
      if (x < 0) {
        x = (window.innerWidth - actualWidth) / 2;
      }
    }

    // Ensure within viewport bounds
    x = Math.max(0, Math.min(x, window.innerWidth - actualWidth));
    y = Math.max(0, Math.min(y, window.innerHeight - actualHeight));

    return { x, y };
  }, [width, height]);

  // Helper function to constrain position within viewport (for dragging)
  const constrainPosition = useCallback((x: number, y: number, popupWidth?: number, popupHeight?: number) => {
    const actualWidth = popupWidth || popupRef.current?.offsetWidth || (typeof width === 'number' ? width : 400);
    const actualHeight = popupHeight || popupRef.current?.offsetHeight || (typeof height === 'number' ? height : 300);
    
    const maxX = window.innerWidth - actualWidth;
    const maxY = window.innerHeight - actualHeight;

    return {
      x: Math.max(0, Math.min(x, maxX)),
      y: Math.max(0, Math.min(y, maxY)),
    };
  }, [width, height]);

  // Expose imperative methods via ref
  useImperativeHandle(ref, () => ({
    show: (x?: number, y?: number) => {
      if (editor) {
        const { from, to } = editor.state.selection;
        savedSelection.current = { from, to };
      }
      
      if (x !== undefined && y !== undefined) {
        keyboardTriggered.current = true;
        const smartPos = getSmartPosition(x, y);
        setPosition(smartPos);
      } else {
        // Use last mouse position if no coordinates provided
        keyboardTriggered.current = true;
        const smartPos = getSmartPosition(lastMousePosition.current.x, lastMousePosition.current.y);
        setPosition(smartPos);
      }
      
      setOpen(true);
    },
    hide: () => {
      setOpen(false);
    },
    toggle: () => {
      setOpen(!open);
    },
    isOpen: () => {
      return open;
    },
  }), [editor, open, setOpen, getSmartPosition]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Only start dragging if clicking on the header
    const target = e.target as HTMLElement;
    if (!target.closest('[data-popup-header]')) return;

    setIsDragging(true);
    dragStartPos.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
    e.preventDefault();
  }, [position]);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;

      const newX = e.clientX - dragStartPos.current.x;
      const newY = e.clientY - dragStartPos.current.y;

      // Constrain to viewport
      setPosition(constrainPosition(newX, newY));
    },
    [isDragging, constrainPosition]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Reset position when popup opens with smart positioning
  React.useEffect(() => {
    if (open) {
      // Use smart positioning for initial placement (avoids overflow)
      // Skip if keyboard triggered (already positioned in keyboard handler)
      if (isInitialPositioning.current && !keyboardTriggered.current) {
        setPosition(getSmartPosition(initialX, initialY));
        isInitialPositioning.current = false;
      } else if (keyboardTriggered.current) {
        isInitialPositioning.current = false;
      }
    } else {
      // Reset flags when popup closes
      isInitialPositioning.current = true;
      keyboardTriggered.current = false;
    }
  }, [open, initialX, initialY, getSmartPosition]);

  // Adjust position when popup dimensions change
  React.useEffect(() => {
    if (open && popupRef.current) {
      // Use ResizeObserver to detect when popup size changes
      const resizeObserver = new ResizeObserver(() => {
        // During initial render, use smart positioning if not keyboard triggered
        if (isInitialPositioning.current && !keyboardTriggered.current) {
          setPosition(getSmartPosition(initialX, initialY));
        } else {
          // After initial render or keyboard trigger, just constrain within bounds
          setPosition((prevPos) => constrainPosition(prevPos.x, prevPos.y));
        }
      });

      resizeObserver.observe(popupRef.current);

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [open, constrainPosition, getSmartPosition, initialX, initialY]);

  // Track mouse position for popup positioning when triggered by keyboard
  useEffect(() => {
    if (!enableKeyboardShortcut) return;

    const handleMouseMove = (event: MouseEvent) => {
      lastMousePosition.current = { x: event.clientX, y: event.clientY };
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [enableKeyboardShortcut]);

  // Keyboard shortcut handler (e.g., Cmd+D to open popup)
  useEffect(() => {
    if (!enableKeyboardShortcut || !editor) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Cmd+Key on Mac or Ctrl+Key on Windows/Linux
      if ((event.metaKey || event.ctrlKey) && event.key === keyboardShortcut) {
        // Don't open if already open
        if (open) return;

        // Check if any other popup is already open (global check)
        const existingPopups = document.querySelectorAll('[data-app-popup-open="true"]');
        if (existingPopups.length > 0) {
          return;
        }

        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();

        // Save current selection before opening
        const { from, to } = editor.state.selection;
        savedSelection.current = { from, to };

        // Mark that this was triggered by keyboard
        keyboardTriggered.current = true;

        // Update position to current mouse position with smart positioning
        const smartPos = getSmartPosition(lastMousePosition.current.x, lastMousePosition.current.y);
        setPosition(smartPos);
        
        // Open popup
        setOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => {
      document.removeEventListener('keydown', handleKeyDown, { capture: true });
    };
  }, [enableKeyboardShortcut, editor, keyboardShortcut, open, setOpen, getSmartPosition]);

  // Restore selection when popup opens
  useEffect(() => {
    if (open && editor && savedSelection.current) {
      const { from, to } = savedSelection.current;
      
      // Use requestAnimationFrame to ensure this happens after the popup renders
      requestAnimationFrame(() => {
        editor.commands.setTextSelection({ from, to });
        // Don't focus the editor to avoid scrolling or losing popup focus
        // The selection will be visible but the editor won't have focus
      });
    }
  }, [open, editor]);

  // Context value to provide to children
  const contextValue: AppPopupContextValue = {
    editor: editor || null,
    savedSelection: savedSelection.current,
    closePopup: () => setOpen(false),
  };

  return (
    <>
      {trigger && (
        <button
          ref={refs.setReference}
          {...getReferenceProps()}
          className="inline-flex items-center justify-center"
        >
          {trigger}
        </button>
      )}

      {open && (
        <FloatingPortal>
          {modal && (
            <FloatingOverlay
              className="bg-black/50 z-[9998]"
              lockScroll
            />
          )}
          <FloatingFocusManager 
            context={context} 
            modal={modal}
            returnFocus={false}
            initialFocus={-1}
          >
            <div
              ref={(node) => {
                refs.setFloating(node);
                if (node) {
                  (popupRef as React.MutableRefObject<HTMLDivElement>).current = node;
                }
              }}
              {...getFloatingProps()}
              data-app-popup-open="true"
              style={{
                position: 'fixed',
                left: position.x,
                top: position.y,
                width: typeof width === 'number' ? `${width}px` : width,
                height: typeof height === 'number' ? `${height}px` : height,
                zIndex: 9999,
              }}
              onMouseDown={handleMouseDown}
              className={`
                bg-white dark:bg-gray-900 
                rounded-lg shadow-2xl 
                border border-gray-200 dark:border-gray-800
                flex flex-col
                ${isDragging ? 'cursor-grabbing' : ''}
                ${className || ''}
              `}
            >
              {/* Header */}
              <div
                data-popup-header
                className={`
                  flex items-center justify-between 
                  px-4 py-3 
                  border-b border-gray-200 dark:border-gray-800
                  bg-gray-50 dark:bg-gray-800/50
                  rounded-t-lg
                  ${!isDragging ? 'cursor-grab' : 'cursor-grabbing'}
                  select-none
                `}
              >
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {title}
                </h3>
                <button
                  onClick={() => setOpen(false)}
                  className="
                    p-1 rounded-md 
                    text-gray-500 hover:text-gray-900 
                    dark:text-gray-400 dark:hover:text-gray-100
                    hover:bg-gray-200 dark:hover:bg-gray-700
                    transition-colors
                  "
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-auto p-4">
                <AppPopupContext.Provider value={contextValue}>
                  {items && items.length > 0 ? (
                    <div className="flex flex-col h-full">
                      {showInstructions && (
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          Use ↑↓ arrow keys to navigate, Enter to select
                        </div>
                      )}

                      <div className="flex-1 border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
                        <AppNavigatableList
                          items={items}
                          onSelect={handleItemSelect}
                          selectedId={selectedItem?.id}
                          autoFocus
                          enableSearch
                          searchPlaceholder={searchPlaceholder}
                          emptyMessage={emptyMessage}
                        />
                      </div>

                      {showFooter && (
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {selectedItem ? selectedItem.label : 'No selection'}
                          </div>
                          <button
                            onClick={() => setOpen(false)}
                            className="px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    children
                  )}
                </AppPopupContext.Provider>
              </div>
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </>
  );
});

AppPopup.displayName = 'AppPopup';

// Hook for programmatic control
export function useAppPopup() {
  const [open, setOpen] = useState(false);

  const openPopup = useCallback(() => setOpen(true), []);
  const closePopup = useCallback(() => setOpen(false), []);
  const togglePopup = useCallback(() => setOpen((prev) => !prev), []);

  return {
    open,
    openPopup,
    closePopup,
    togglePopup,
    setOpen,
  };
}

// Example usage component
export function AppPopupExample() {
  const { open, setOpen } = useAppPopup();

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Draggable Popup Example</h2>
      
      <div className="space-y-4">
        {/* Controlled Popup */}
        <AppPopup
          trigger={
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Open Draggable Popup
            </button>
          }
          title="Draggable Popup"
          open={open}
          onOpenChange={setOpen}
          initialX={200}
          initialY={150}
          width={500}
          height={400}
          modal={true}
        >
          <div className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300">
              This is a draggable popup! You can drag it by clicking and holding the header.
            </p>
            
            <div className="space-y-2">
              <h4 className="font-semibold">Features:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li>Drag by clicking the header</li>
                <li>Constrained to viewport boundaries</li>
                <li>Smooth dragging animation</li>
                <li>Modal overlay (optional)</li>
                <li>Click outside to dismiss</li>
                <li>Fully typed with TypeScript</li>
                <li>Styled with Tailwind CSS</li>
              </ul>
            </div>

            <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                The popup position is constrained within the viewport to ensure it stays visible.
              </p>
            </div>
          </div>
        </AppPopup>

        {/* Uncontrolled Popup */}
        <AppPopup
          trigger={
            <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
              Open Another Popup
            </button>
          }
          title="Uncontrolled Popup"
          initialX={300}
          initialY={200}
          width={400}
        >
          <div>
            <p className="text-gray-700 dark:text-gray-300">
              This is an uncontrolled popup (manages its own state).
            </p>
          </div>
        </AppPopup>
      </div>
    </div>
  );
}

