import { ApiResponseList } from '../shared/api/ApiResponseList';
import { UserResponse } from './User';

export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
  author?: UserResponse;
  tags?: string[];
  reactions?: {
    likes: number;
    dislikes: number;
  };
}

export type PostsResponse = ApiResponseList<Post, 'posts'>;

export type NewPost = Pick<Post, 'title' | 'body' | 'userId'>;
