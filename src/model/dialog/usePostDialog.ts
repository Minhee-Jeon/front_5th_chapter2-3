import { useDialog } from './useDialog';

export const usePostAddDialog = () => {
  const dialog = useDialog();
  const openPostAddDialog = dialog.open;

  return { dialog, openPostAddDialog };
};

export const usePostUpdateDialog = () => {
  const dialog = useDialog();
  const openPostUpdateDialog = dialog.open;

  return { dialog, openPostUpdateDialog };
};
