import { createQueryKeys } from '@lukemorales/query-key-factory';

export const tagsQueryKeys = createQueryKeys('tags', {
  list: {
    queryKey: ['tags', 'list'],
  },
});
