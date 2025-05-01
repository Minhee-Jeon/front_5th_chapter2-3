import { createQueryKeys } from '@lukemorales/query-key-factory';

export const usersQueryKeys = createQueryKeys('users', {
  list: {
    queryKey: ['users'],
  },
  detail: (userId: number) => ({
    queryKey: [userId],
  }),
});
