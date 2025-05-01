import { ApiResponseList } from '../../../shared/api';
import { Post } from '../model/Post';

export type PostsResponse = ApiResponseList<Post, 'posts'>;
