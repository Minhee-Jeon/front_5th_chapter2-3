import { NewPost } from '../../types/Post';

export const initialNewPost: NewPost = {
  title: '',
  body: '',
  userId: 1,
} as const;
