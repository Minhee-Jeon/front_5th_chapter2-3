import { useState } from 'react';

interface UseDialogProps {
  initialState?: boolean;
}

export const useDialog = ({ initialState = false }: UseDialogProps = {}) => {
  const [isOpen, setIsOpen] = useState(initialState);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return {
    isOpen,
    open,
    close,
  };
};
