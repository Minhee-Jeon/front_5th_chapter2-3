import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { User } from '../../../entities/users/model/User';
import { UsersResponse } from '../../../entities/users/api/UserResponse';
import { get } from '../../../shared/api/fetchBased';

import { usersQueryKeys } from '../config/userQueryKeys';
import { getMswUrl } from '../../../shared/constants/mswUrl';

export const useQueryUsers = () => {
  const { queryKey } = usersQueryKeys.list;
  const queryFn = () => get(`${getMswUrl}/users?limit=0&select=username,image`);

  return useQuery<UsersResponse>({ queryKey, queryFn } as UseQueryOptions<
    UsersResponse,
    Error
  >);
};

export const useQueryUser = (id: number) => {
  const { queryKey } = usersQueryKeys.detail(id);
  const queryFn = () => get(`/api/users/${id}`);

  return useQuery<User>({ queryKey, queryFn });
};
