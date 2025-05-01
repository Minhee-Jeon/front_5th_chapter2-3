import { BaseDialog } from '../ui/BaseDialog';
import type { usePostUpdateDialog } from '../../model/dialog/usePostDialog';
import { useUpdatePost } from '../../api/posts/usePostsMutations';
import { usePostsStoreSelector } from '../../stores/posts/usePostsStore';
import { useSelectedPostStore } from '../../stores/posts/useSelectedPostStore';
import { Button, Input, Textarea } from '../../shared/ui';

interface Props {
  state: ReturnType<typeof usePostUpdateDialog>['dialog'];
}
/**
 * 게시물 수정 다이얼로그
 */
export default function PostUpdateDialog({ state }: Props) {
  const { selectedPost, setSelectedPost } = useSelectedPostStore();
  const { mutateAsync: mutatePostUpdate } = useUpdatePost();
  const { updatePost } = usePostsStoreSelector(['updatePost']);

  // 게시물 업데이트
  const handleUpdatePost = async () => {
    try {
      await mutatePostUpdate(selectedPost!, {
        onSuccess: (updatedPost) => {
          updatePost(updatedPost);
          state.close();
        },
      });
    } catch (error) {
      console.error('게시물 업데이트 오류:', error);
    }
  };

  return (
    <BaseDialog
      open={state.isOpen}
      onOpenChange={state.close}
      title="게시물 수정"
    >
      <div className="space-y-4">
        <Input
          placeholder="제목"
          value={selectedPost?.title || ''}
          onChange={(e) =>
            selectedPost &&
            setSelectedPost({ ...selectedPost, title: e.target.value })
          }
        />
        <Textarea
          rows={15}
          placeholder="내용"
          value={selectedPost?.body || ''}
          onChange={(e) =>
            selectedPost &&
            setSelectedPost({ ...selectedPost, body: e.target.value })
          }
        />
        <Button onClick={handleUpdatePost}>게시물 업데이트</Button>
      </div>
    </BaseDialog>
  );
}
