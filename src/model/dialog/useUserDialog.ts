import type { User } from '../../types';
import { useSelectedUserMutation } from '../../api/users/useUsersMutations';
import { useDialog } from './useDialog';

export const useUserDialog = () => {
  const dialog = useDialog();
  const { selectedUser, setSelectedUser } = useSelectedUserMutation();

  const onOpenUserDialog = async (user: User) => {
    try {
      setSelectedUser(user.id);
      dialog.open();
    } catch (error) {
      console.error('사용자 정보 가져오기 오류:', error);
      dialog.close();
    }
  };

  return { dialog, selectedUser, onOpenUserDialog };
};
