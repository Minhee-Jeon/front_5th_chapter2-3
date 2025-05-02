import { useQuery } from '@tanstack/react-query';

import type { Tag } from '../../../entities/tags/model/Tag';
import { get } from '../../../shared/api/fetchBased';

import { tagsQueryKeys } from '../config/tagQueryKeys';
import { getMswUrl } from '../../../shared/constants/mswUrl';

export const useTagsQuery = () =>
  useQuery<Tag[]>({
    queryKey: tagsQueryKeys.list.queryKey,
    queryFn: () => get(`${getMswUrl}/posts/tags`),
  });
