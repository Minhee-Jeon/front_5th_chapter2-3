import { get, post, put, patch, remove } from '../../shared/api/fetchBased';
import { getMswUrl } from '../../shared/constants/mswUrl';
import type { Comment } from '../../types';

const fetchComments = async (postId: number): Promise<Comment[]> => {
  const url = `${getMswUrl}/comments/post/${postId}`;
  return get(url);
};

const createComment = async (data: Comment): Promise<Comment> => {
  const url = `${getMswUrl}/comments/add`;
  return post(url, data);
};

const updateComment = async (comment: Partial<Comment>): Promise<Comment> => {
  const url = `${getMswUrl}/comments/${comment.id}`;
  return put(url, { body: comment.body });
};

const deleteComment = async (id: number): Promise<void> => {
  const url = `${getMswUrl}/comments/${id}`;
  return remove(url);
};

const likeComment = async (
  id: number,
  value: number,
  type: 'likes' | 'dislikes' = 'likes',
): Promise<Comment> => {
  const url = `${getMswUrl}/comments/${id}`;
  return patch(url, { [type]: (value || 0) + 1 });
};

export const commentsApi = {
  fetchComments,
  createComment,
  updateComment,
  deleteComment,
  likeComment,
};
