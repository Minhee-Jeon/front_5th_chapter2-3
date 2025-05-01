import { ApiResponseList } from '../../../shared/api';

export type CommentsResponse = ApiResponseList<Comment, 'comments'>;
