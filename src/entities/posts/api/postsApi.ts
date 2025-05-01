import type { UserResponse, UsersResponse } from '../../../types';
import { PostsUrlParams } from '../model/PostUrlParams';
import { get, post, put, remove } from '../../../shared/api/fetchBased';
import { getMswUrl } from '../../../shared/constants/mswUrl';
import { Post } from '../model/Post';
import { PostsResponse } from './PostsResponse';

const getPosts = async (params: string): Promise<PostsResponse> => {
  const url = `${getMswUrl}/posts?${params}`;
  return get(url);
};

const getPostById = async (id: number) => {
  const url = `${getMswUrl}/posts/${id}`;
  return get(url);
};

const getPostsWithUsers = async (params: PostsUrlParams): Promise<Post[]> => {
  const stringifiedParams = new URLSearchParams(
    Object.entries(params).map(([key, value]) => [key, String(value)]),
  ).toString();

  const [postsResponse, usersResponse] = await Promise.all([
    get(`${getMswUrl}/posts?${stringifiedParams}`),
    get(`${getMswUrl}/users?limit=0&select=username,image`),
  ]);

  const { posts }: PostsResponse = await postsResponse;
  const { users }: UsersResponse = await usersResponse;

  return posts.map((post) => ({
    ...post,
    author: users.find((user) => user.id === post.userId) as UserResponse,
  }));
};

const addPost = async (data: Pick<Post, 'title' | 'body' | 'userId'>) => {
  const url = `${getMswUrl}/posts/add`;
  return post(url, data);
};

const updatePost = async (post: Post | null) => {
  const url = `${getMswUrl}/posts/${post?.id}`;
  return put(url, post);
};

const deletePost = async (id: number) => {
  const url = `${getMswUrl}/posts/${id}`;
  return remove(url);
};

export const postsApi = {
  getPosts,
  getPostById,
  getPostsWithUsers,
  addPost,
  updatePost,
  deletePost,
};
