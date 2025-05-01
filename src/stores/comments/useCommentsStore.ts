import type { Comment } from '../../types';
import { createStoreSelector } from '../../shared/lib';
import { create } from 'zustand';

export const useCommentsStore = create<{
  comments: Record<number, Comment[]>;
  setComments: (
    updateFn: (
      prevComments: Record<number, Comment[]>,
    ) => Record<number, Comment[]>,
  ) => void;
}>((set) => ({
  comments: {},
  setComments: (updateFn) =>
    set((state) => ({
      comments: updateFn(state.comments),
    })),
}));

export const useCommentsStoreSelector = createStoreSelector(useCommentsStore);
