import { useState } from 'react';

export function useFilterSheet() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeCount, setActiveCount] = useState(0);

  function handleOpenFilter() {
    setIsFilterOpen(true);
  }

  function handleCloseFilter() {
    setIsFilterOpen(false);
  }

  return { isFilterOpen, activeCount, setActiveCount, handleOpenFilter, handleCloseFilter };
}
