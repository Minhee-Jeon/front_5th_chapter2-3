import { ApiResponseList } from '../shared/api/ApiResponseList';

export interface Comment {
  id: number;
  body: string;
  postId: number;
  likes: number;
  user: {
    id: number;
    username: string;
  };
}

export type Comments = ApiResponseList<Comment, 'comments'>;
