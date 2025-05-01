import { useUrlParams } from '../../lib/posts/useUrlParams';
import { useDialog } from '../../features/dialog/model/useDialog';
import { HighlightedText } from '../../shared/ui/HighlightedText';
import { useSelectedPostStore } from '../../features/posts/model/useSelectedPostStore';
import { BaseDialog } from '../ui/BaseDialog';

interface Props {
  state: ReturnType<typeof useDialog>;
  renderComments: (postId: number) => React.ReactNode;
}

/**
 * Post 추가 다이얼로그
 */
export default function PostDetailDialog({ state, renderComments }: Props) {
  const { selectedPost } = useSelectedPostStore();
  const searchQuery = useUrlParams().search;

  return (
    <BaseDialog
      open={state.isOpen}
      onOpenChange={state.close}
      title={
        selectedPost?.title && (
          <HighlightedText text={selectedPost?.title} highlight={searchQuery} />
        )
      }
    >
      <p>
        {selectedPost?.body && (
          <HighlightedText text={selectedPost?.body} highlight={searchQuery} />
        )}
      </p>
      {selectedPost?.id ? renderComments(selectedPost?.id) : null}
    </BaseDialog>
  );
}
