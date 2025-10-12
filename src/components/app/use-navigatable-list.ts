import { useState, useCallback } from 'react';
import { AppNavigatableListItem } from './app-navigatable-list';

export function useNavigatableList(initialItems: AppNavigatableListItem[] = []) {
  const [items, setItems] = useState<AppNavigatableListItem[]>(initialItems);
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [activeIndex, setActiveIndex] = useState(0);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSelect = useCallback((item: AppNavigatableListItem, _index: number) => {
    setSelectedId(item.id);
  }, []);

  const handleActiveChange = useCallback((_item: AppNavigatableListItem | null, index: number) => {
    setActiveIndex(index);
  }, []);

  return {
    items,
    setItems,
    selectedId,
    setSelectedId,
    activeIndex,
    setActiveIndex,
    handleSelect,
    handleActiveChange,
  };
}

