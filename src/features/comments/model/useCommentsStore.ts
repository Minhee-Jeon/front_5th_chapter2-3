import type { Comment } from '../../../entities/comments/model/Comment';
import { get as fetchGet } from '../../../shared/api/fetchBased';
import { createStoreSelector } from '../../../shared/lib';
import { create } from 'zustand';
import { getMswUrl } from '../../../shared/constants/mswUrl';

export const useCommentsStore = create<{
  comments: Record<number, Comment[]>;
  setComments: (
    updateFn: (
      prevComments: Record<number, Comment[]>,
    ) => Record<number, Comment[]>,
  ) => void;
  getComments: (postId: number) => void;
}>((set, get) => ({
  comments: {},
  setComments: (updateFn) =>
    set((state) => ({
      comments: updateFn(state.comments),
    })),
  getComments: async (postId: number) => {
    const { comments, setComments } = get();

    if (comments[postId]) return; // 이미 불러온 댓글이 있으면 다시 불러오지 않음
    try {
      const data = await fetchGet(`${getMswUrl}/comments/post/${postId}`);
      setComments((prev) => ({ ...prev, [postId]: data.comments }));
    } catch (error) {
      console.error('댓글 가져오기 오류:', error);
    }
  },
}));

export const useCommentsStoreSelector = createStoreSelector(useCommentsStore);
