import { get } from '../../../shared/api/fetchBased';
import { useMutation } from '@tanstack/react-query';

export const useSelectedUserMutation = () => {
  const { data: selectedUser, mutate: setSelectedUser } = useMutation({
    mutationFn: (id: number) => get(`/api/users/${id}`),
  });

  return { selectedUser, setSelectedUser };
};
