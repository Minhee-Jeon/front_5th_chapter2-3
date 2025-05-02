import { create } from 'zustand';

import { createStoreSelector } from '../../../shared/lib';

import type { Post } from '../../../entities/posts/model';

export interface PostsStore {
  posts: Post[];
  setPosts: (posts: Post[]) => void;
  addPost: (post: Post) => void;
  deletePost: (postId: number) => void;
  updatePost: (post: Post) => void;
}

export const usePostsStore = create<PostsStore>()((set) => ({
  posts: [],
  setPosts: (posts) => set({ posts }),
  addPost: (post) => set((state) => ({ posts: [...state.posts, post] })),
  deletePost: (postId) =>
    set((state) => ({
      posts: state.posts.filter((post) => post.id !== postId),
    })),
  updatePost: (post) =>
    set((state) => ({
      posts: state.posts.map((p) => (p.id === post.id ? post : p)),
    })),
}));

export const usePostsStoreSelector = createStoreSelector(usePostsStore);
