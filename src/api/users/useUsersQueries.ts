import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { UsersResponse } from '../../types/User';
import { get } from '../../shared/api/fetchBased';

import { usersQueryKeys } from '../../config/users/userQueryKeys';

export const useQueryUsers = () => {
  const { queryKey } = usersQueryKeys.list;
  const queryFn = () => get('/api/users?limit=0&select=username,image');

  return useQuery<UsersResponse>({ queryKey, queryFn } as UseQueryOptions<
    UsersResponse,
    Error
  >);
};
