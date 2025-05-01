import { NewPost } from '../../entities/posts/model/NewPost';

export const initialNewPost: NewPost = {
  title: '',
  body: '',
  userId: 1,
} as const;
