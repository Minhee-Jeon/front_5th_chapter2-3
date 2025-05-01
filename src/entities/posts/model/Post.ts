import { ApiResponseList } from '../../../shared/api';
import { UserResponse } from '../../../types';

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
