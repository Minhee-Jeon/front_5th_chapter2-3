import { ApiResponseList } from '../shared/api/ApiResponseList';

export interface Tag {
  slug: string;
  url: string;
}

export type Tags = ApiResponseList<Tag, 'tags'>;
