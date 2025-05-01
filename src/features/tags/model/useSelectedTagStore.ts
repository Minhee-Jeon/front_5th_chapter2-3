import { create } from 'zustand';

export const useSelectedTagsStore = create<{
  selectedTag: string;
  setSelectedTag: (tag: string) => void;
}>((set) => ({
  selectedTag: '',
  setSelectedTag: (tag) => set({ selectedTag: tag }),
}));
