import type { Post, PostsResponse } from '../../types';
import { get, post, put, remove } from '../../shared/api/fetchBased';

const getPosts = async (
  limit: number,
  skip: number,
): Promise<PostsResponse> => {
  const url = `/api/posts?limit=${limit}&skip=${skip}`;
  return get(url);
};

const getPostById = async (id: number) => {
  const url = `/api/posts/${id}`;
  return get(url);
};

const addPost = async (data: Pick<Post, 'title' | 'body' | 'userId'>) => {
  const url = '/api/posts/add';
  return post(url, data);
};

const updatePost = async (post: Post | null) => {
  const url = `/api/posts/${post?.id}`;
  return put(url, post);
};

const deletePost = async (id: number) => {
  const url = `/api/posts/${id}`;
  return remove(url);
};

export const postsApi = {
  getPosts,
  getPostById,
  addPost,
  updatePost,
  deletePost,
};
