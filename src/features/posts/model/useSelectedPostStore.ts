import { create } from 'zustand';
import type { Post } from '../../../entities/posts/model';
import { createStoreSelector } from '../../../shared/lib';

// selectedPost 전역 상태 사용을 위한 hook
export interface SelectedPostStore {
  selectedPost: Post;
  setSelectedPost: (post: Post) => void;
}

export const useSelectedPostStore = create<SelectedPostStore>()((set) => ({
  selectedPost: {} as Post,
  setSelectedPost: (post) =>
    set({
      selectedPost: post,
    }),
}));

export const useSelectedPostStoreSelector =
  createStoreSelector(useSelectedPostStore);
