import { useDialog } from '../../model/dialog/useDialog';
import { post } from '../../shared/api/fetchBased';
import { Button, Textarea } from '../../shared/ui';
import { useCommentsStoreSelector } from '../../stores/comments/useCommentsStore';
import { useNewCommentStoreSelector } from '../../stores/comments/useNewCommentStore';
import { BaseDialog } from '../ui/BaseDialog';

interface Props {
  state: ReturnType<typeof useDialog>;
}
/**
 * Comment 추가 다이얼로그
 */
export default function CommentAddDialog({ state }: Props) {
  const { setComments } = useCommentsStoreSelector(['setComments']);
  const { newComment, updateNewComment, resetNewComment } =
    useNewCommentStoreSelector([
      'newComment',
      'updateNewComment',
      'resetNewComment',
    ]);

  const handleAddComment = async () => {
    try {
      const data = await post('/api/comments/add', newComment);
      setComments((prev) => ({
        ...prev,
        [data.postId]: [...(prev[data.postId] || []), data],
      }));
      state.close();
      resetNewComment();
    } catch (error) {
      console.error('댓글 추가 오류:', error);
    }
  };

  return (
    <BaseDialog
      open={state.isOpen}
      onOpenChange={state.close}
      title="새 댓글 추가"
    >
      <Textarea
        placeholder="댓글 내용"
        value={newComment?.body}
        onChange={(e) =>
          updateNewComment({ ...newComment, body: e.target.value })
        }
      />
      <Button onClick={handleAddComment}>댓글 추가</Button>
    </BaseDialog>
  );
}
