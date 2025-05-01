import { Post } from './Post';

export type NewPost = Pick<Post, 'title' | 'body' | 'userId'>;
