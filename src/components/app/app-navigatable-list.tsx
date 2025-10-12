import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Check } from 'lucide-react';

export interface AppNavigatableListItem {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  metadata?: Record<string, unknown>;
}

interface AppNavigatableListProps {
  items: AppNavigatableListItem[];
  onSelect?: (item: AppNavigatableListItem, index: number) => void;
  onActiveChange?: (item: AppNavigatableListItem | null, index: number) => void;
  selectedId?: string;
  initialActiveIndex?: number;
  className?: string;
  itemClassName?: string;
  autoFocus?: boolean;
  enableSearch?: boolean;
  searchPlaceholder?: string;
  emptyMessage?: string;
  renderItem?: (item: AppNavigatableListItem, isActive: boolean, isSelected: boolean) => React.ReactNode;
}

export function AppNavigatableList({
  items,
  onSelect,
  onActiveChange,
  selectedId,
  initialActiveIndex = 0,
  className = '',
  itemClassName = '',
  autoFocus = true,
  enableSearch = false,
  searchPlaceholder = 'Search...',
  emptyMessage = 'No items found',
  renderItem,
}: AppNavigatableListProps) {
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);
  const [searchQuery, setSearchQuery] = useState('');
  const listRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter items based on search query
  const filteredItems = searchQuery
    ? items.filter((item) =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : items;

  // Ensure active index is within bounds
  useEffect(() => {
    if (activeIndex >= filteredItems.length && filteredItems.length > 0) {
      setActiveIndex(filteredItems.length - 1);
    } else if (activeIndex < 0 && filteredItems.length > 0) {
      setActiveIndex(0);
    }
  }, [activeIndex, filteredItems.length]);

  // Notify parent of active item changes
  useEffect(() => {
    if (onActiveChange && filteredItems.length > 0 && activeIndex >= 0) {
      onActiveChange(filteredItems[activeIndex], activeIndex);
    }
  }, [activeIndex, filteredItems, onActiveChange]);

  // Scroll active item into view
  useEffect(() => {
    if (itemRefs.current[activeIndex]) {
      itemRefs.current[activeIndex]?.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      });
    }
  }, [activeIndex]);

  // Auto focus
  useEffect(() => {
    if (autoFocus) {
      if (enableSearch && searchInputRef.current) {
        searchInputRef.current.focus();
      } else {
        listRef.current?.focus();
      }
    }
  }, [autoFocus, enableSearch]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (filteredItems.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setActiveIndex((prev) => {
            let next = prev + 1;
            // Skip disabled items
            while (next < filteredItems.length && filteredItems[next].disabled) {
              next++;
            }
            return next < filteredItems.length ? next : prev;
          });
          break;

        case 'ArrowUp':
          e.preventDefault();
          setActiveIndex((prev) => {
            let next = prev - 1;
            // Skip disabled items
            while (next >= 0 && filteredItems[next].disabled) {
              next--;
            }
            return next >= 0 ? next : prev;
          });
          break;

        case 'Enter':
          e.preventDefault();
          if (activeIndex >= 0 && activeIndex < filteredItems.length) {
            const item = filteredItems[activeIndex];
            if (!item.disabled) {
              onSelect?.(item, activeIndex);
            }
          }
          break;

        case 'Home':
          e.preventDefault();
          setActiveIndex(0);
          break;

        case 'End':
          e.preventDefault();
          setActiveIndex(filteredItems.length - 1);
          break;

        default:
          break;
      }
    },
    [filteredItems, activeIndex, onSelect]
  );

  const handleItemClick = (item: AppNavigatableListItem, index: number) => {
    if (item.disabled) return;
    setActiveIndex(index);
    onSelect?.(item, index);
  };

  const handleItemMouseEnter = (index: number) => {
    setActiveIndex(index);
  };

  const renderDefaultItem = (item: AppNavigatableListItem, _isActive: boolean, isSelected: boolean) => (
    <div className="flex items-center gap-3 w-full">
      {item.icon && (
        <div className="flex-shrink-0 text-gray-500 dark:text-gray-400">
          {item.icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
          {item.label}
        </div>
        {item.description && (
          <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {item.description}
          </div>
        )}
      </div>
      {isSelected && (
        <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
      )}
    </div>
  );

  return (
    <div className={`flex flex-col ${className}`}>
      {enableSearch && (
        <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={searchPlaceholder}
            className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        </div>
      )}

      <div
        ref={listRef}
        tabIndex={enableSearch ? -1 : 0}
        onKeyDown={!enableSearch ? handleKeyDown : undefined}
        className="flex-1 overflow-y-auto focus:outline-none"
        role="listbox"
        aria-activedescendant={filteredItems[activeIndex]?.id}
      >
        {filteredItems.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
            {emptyMessage}
          </div>
        ) : (
          <div className="py-1">
            {filteredItems.map((item, index) => {
              const isActive = index === activeIndex;
              const isSelected = item.id === selectedId;

              return (
                <div
                  key={item.id}
                  ref={(el) => {
                    itemRefs.current[index] = el;
                    return undefined;
                  }}
                  role="option"
                  aria-selected={isActive}
                  aria-disabled={item.disabled}
                  onClick={() => handleItemClick(item, index)}
                  onMouseEnter={() => handleItemMouseEnter(index)}
                  className={`
                    px-3 py-2 cursor-pointer transition-colors
                    ${isActive
                      ? 'bg-blue-50 dark:bg-blue-900/20'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                    }
                    ${item.disabled
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                    }
                    ${itemClassName}
                  `}
                >
                  {renderItem
                    ? renderItem(item, isActive, isSelected)
                    : renderDefaultItem(item, isActive, isSelected)}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
