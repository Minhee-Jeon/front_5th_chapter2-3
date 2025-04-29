import { User } from './User';

export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
  author?: User;
  tags?: string[];
  reactions?: {
    likes: number;
    dislikes: number;
  };
}
