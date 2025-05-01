import { useQuery } from '@tanstack/react-query';

import type { Tag } from '../../types';
import { get } from '../../shared/api/fetchBased';

import { tagsQueryKeys } from '../../config/tags/tagQueryKeys';
import { getMswUrl } from '../../shared/constants/mswUrl';

export const useTagsQuery = () =>
  useQuery<Tag[]>({
    queryKey: tagsQueryKeys.list.queryKey,
    queryFn: () => get(`${getMswUrl}/posts/tags`),
  });
