import { UserResponse } from '../../users/api/UserResponse';

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
