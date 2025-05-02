import type { PropsWithChildren } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../../shared/ui';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string | React.ReactNode;
  maxWidth?: string;
}

/**
 * 중복 제거, 일관성을 위한 공통 다이얼로그 컴포넌트
 */
export const BaseDialog = ({
  open,
  onOpenChange,
  title,
  maxWidth = 'max-w-lg',
  children,
}: PropsWithChildren<Props>) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className={maxWidth}>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">{children}</div>
    </DialogContent>
  </Dialog>
);
