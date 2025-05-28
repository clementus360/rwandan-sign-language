// stores/useSearchStore.ts
import { useSegments } from 'expo-router';
import { useEffect } from 'react';
import { create } from 'zustand';

interface SearchStore {
  value: string;
  setValue: (val: string) => void;
  clear: () => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
  value: '',
  setValue: (val: string) => set({ value: val }),
  clear: () => set({ value: '' }),
}));

// Optional: Automatically clear search when route changes
export function useResetSearchOnNavigation() {
  const segments = useSegments();
  const clear = useSearchStore(state => state.clear);

  useEffect(() => {
    clear();
  }, [segments.join('/')]);
}
