import { get, post, put, patch, remove } from '../../shared/api/fetchBased';
import type { Comment } from '../../types';

const fetchComments = async (postId: number): Promise<Comment[]> => {
  const url = `/api/comments/post/${postId}`;
  return get(url);
};

const createComment = async (data: Comment): Promise<Comment> => {
  const url = '/api/comments/add';
  return post(url, data);
};

const updateComment = async (comment: Partial<Comment>): Promise<Comment> => {
  const url = `/api/comments/${comment.id}`;
  return put(url, { body: comment.body });
};

const deleteComment = async (id: number): Promise<void> => {
  const url = `/api/comments/${id}`;
  return remove(url);
};

const likeComment = async (
  id: number,
  value: number,
  type: 'likes' | 'dislikes' = 'likes',
): Promise<Comment> => {
  const url = `/api/comments/${id}`;
  return patch(url, { [type]: (value || 0) + 1 });
};

export const commentsApi = {
  fetchComments,
  createComment,
  updateComment,
  deleteComment,
  likeComment,
};
