import type { User } from '../../types';
import { useSelectedUserStore } from '../../stores/users/useSelectedUserStore';
import { get } from '../../shared/api/fetchBased';

import { useDialog } from './useDialog';

export const useUserDialog = () => {
  const dialog = useDialog();
  const { selectedUser, setSelectedUser } = useSelectedUserStore();

  const onOpenUserDialog = async (user: User) => {
    try {
      const userData = await get(`/api/users/${user.id}`);
      setSelectedUser(userData);
      dialog.open();
    } catch (error) {
      console.error('사용자 정보 가져오기 오류:', error);
      dialog.close();
    }
  };

  return { dialog, selectedUser, onOpenUserDialog };
};
