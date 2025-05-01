import type { Comment } from '../../types';
import { create } from 'zustand';

export const useSelectedCommentStore = create<{
  selectedComment: Comment | null;
  setSelectedComment: (comment: Comment) => void;
}>((set) => ({
  selectedComment: null,
  setSelectedComment: (comment) => set({ selectedComment: comment }),
}));
