import type { Comment } from '../../types';
import { createStoreSelector } from '../../../shared/lib';
import { create } from 'zustand';
import { initialComment } from '../config/initialData';

export const useNewCommentStore = create<{
  newComment: Partial<Comment> | null;
  updateNewComment: (comment: Partial<Comment>) => void;
  resetNewComment: () => void;
}>((set) => ({
  newComment: initialComment,
  updateNewComment: (comment) => set({ newComment: comment }),
  resetNewComment: () => set({ newComment: initialComment }),
}));

export const useNewCommentStoreSelector =
  createStoreSelector(useNewCommentStore);
