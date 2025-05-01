import { Button, Textarea } from '../../shared/ui';
import { BaseDialog } from '../ui/BaseDialog';
import { useDialog } from '../../model/dialog/useDialog';
import { useCommentsStoreSelector } from '../../stores/comments/useCommentsStore';
import { useNewCommentStoreSelector } from '../../stores/comments/useNewCommentStore';
import { put } from '../../shared/api/fetchBased';
import { useSelectedCommentStoreSelector } from '../../stores/comments/useSelectedCommentStore';

interface Props {
  state: ReturnType<typeof useDialog>;
}
/**
 * Comment 수정 다이얼로그
 */
export default function CommentEditDialog({ state }: Props) {
  const { setComments } = useCommentsStoreSelector(['setComments']);
  const { newComment, resetNewComment } = useNewCommentStoreSelector([
    'newComment',
    'resetNewComment',
  ]);
  const { selectedComment, setSelectedComment } =
    useSelectedCommentStoreSelector(['selectedComment', 'setSelectedComment']);

  const handleUpdateComment = async () => {
    try {
      const data = await put(
        `/api/comments/${selectedComment?.id}`,
        newComment,
      );
      setComments((prev) => ({
        ...prev,
        [data.postId]: [...(prev[data.postId] || []), data],
      }));
      state.close();
      resetNewComment();
    } catch (error) {
      console.error('댓글 업데이트 오류:', error);
    }
  };
  return (
    <BaseDialog
      open={state.isOpen}
      onOpenChange={state.close}
      title="댓글 수정"
    >
      <Textarea
        placeholder="댓글 내용"
        value={selectedComment?.body || ''}
        onChange={(e) =>
          selectedComment &&
          setSelectedComment({ ...selectedComment, body: e.target.value })
        }
      />
      <Button onClick={handleUpdateComment}>댓글 업데이트</Button>
    </BaseDialog>
  );
}
