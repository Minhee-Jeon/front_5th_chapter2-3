import { create } from 'zustand';
import type { UsersResponse } from '../../types';

// selectedUser 전역 상태 사용을 위한 hook
export interface SelectedUserStore {
  selectedUser: UsersResponse['users'][0] | null;
  setSelectedUser: (post: UsersResponse['users'][0]) => void;
}

export const useSelectedUserStore = create<SelectedUserStore>()((set) => ({
  selectedUser: null,
  setSelectedUser: (post) => set({ selectedUser: post }),
}));
