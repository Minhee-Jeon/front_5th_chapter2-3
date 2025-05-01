import type {
  Post,
  PostsResponse,
  UserResponse,
  UsersResponse,
} from '../../types';
import { PostsUrlParams } from '../../lib/posts/PostUrlParams';
import { get, post, put, remove } from '../../shared/api/fetchBased';

const getPosts = async (params: string): Promise<PostsResponse> => {
  const url = `/api/posts?${params}`;
  return get(url);
};

const getPostById = async (id: number) => {
  const url = `/api/posts/${id}`;
  return get(url);
};

const getPostsWithUsers = async (params: PostsUrlParams): Promise<Post[]> => {
  const stringifiedParams = new URLSearchParams(
    Object.entries(params).map(([key, value]) => [key, String(value)]),
  ).toString();

  const [postsResponse, usersResponse] = await Promise.all([
    get(`/api/posts?${stringifiedParams}`),
    get('/api/users?limit=0&select=username,image'),
  ]);

  const { posts }: PostsResponse = await postsResponse;
  const { users }: UsersResponse = await usersResponse;

  return posts.map((post) => ({
    ...post,
    author: users.find((user) => user.id === post.userId) as UserResponse,
  }));
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
  getPostsWithUsers,
  addPost,
  updatePost,
  deletePost,
};
