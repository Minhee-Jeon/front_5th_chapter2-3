import { createQueryKeys } from '@lukemorales/query-key-factory';
import { get } from '../../shared/api/fetchBased';

export const usersQueryKeys = createQueryKeys('users', {
  list: {
    queryKey: null,
    queryFn: () => get('/api/users?limit=0&select=username,image'),
  },
  detail: (userId: number) => ({
    queryKey: [userId],
    queryFn: () => get(`/api/users/${userId}`),
  }),
});
