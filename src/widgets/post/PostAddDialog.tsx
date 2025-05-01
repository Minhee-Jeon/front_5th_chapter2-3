import { BaseDialog } from '../ui/BaseDialog';
import type { useDialog } from '../../features/dialog/model/useDialog';
import { usePostsStoreSelector } from '../../features/posts/model/usePostsStore';
import { useAddPost } from '../../api/posts/usePostsMutations';
import { useNewPost } from '../../features/posts/model/useNewPost';
import { Button, Input, Textarea } from '../../shared/ui';

interface Props {
  state: ReturnType<typeof useDialog>;
}

export default function PostAddDialog({ state }: Props) {
  const { newPost, updateNewPost, resetNewPost } = useNewPost();
  const { mutateAsync: mutatePostAdd } = useAddPost();
  const { addPost } = usePostsStoreSelector(['posts', 'addPost']);

  // 게시물 추가
  const handleAddPost = async () => {
    try {
      await mutatePostAdd(newPost, {
        onSuccess: (post) => {
          addPost(post);
          state.close();
          resetNewPost();
        },
      });
    } catch (error) {
      console.error('게시물 추가 오류:', error);
    }
  };

  return (
    <BaseDialog
      open={state.isOpen}
      onOpenChange={state.close}
      title="새 게시물 추가"
    >
      <Input
        placeholder="제목"
        value={newPost.title}
        onChange={(e) => updateNewPost('title', e.target.value)}
      />
      <Textarea
        rows={30}
        placeholder="내용"
        value={newPost.body}
        onChange={(e) => updateNewPost('body', e.target.value)}
      />
      <Input
        type="number"
        placeholder="사용자 ID"
        value={newPost.userId}
        onChange={(e) => updateNewPost('userId', Number(e.target.value))}
      />
      <Button onClick={handleAddPost}>게시물 추가</Button>
    </BaseDialog>
  );
}
