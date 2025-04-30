import { usePostsStoreSelector } from '../../stores/posts/usePostsStore';
import { useAddPost } from '../../api/posts/usePostsMutations';
import { useNewPost } from '../../model/posts/useNewPost';
import { Dialog, DialogContent, DialogTitle } from '@radix-ui/react-dialog';
import { Button, DialogHeader, Input, Textarea } from '../../shared/ui';

interface Props {
  open: boolean;
  onOpenChange: (show: boolean) => void;
}

export default function PostAddDialog({ open, onOpenChange }: Props) {
  const { newPost, updateNewPost, resetNewPost } = useNewPost();
  const { mutateAsync: mutatePostAdd } = useAddPost();
  const { addPost } = usePostsStoreSelector(['posts', 'addPost']);

  // 게시물 추가
  const handleAddPost = async () => {
    try {
      await mutatePostAdd(newPost, {
        onSuccess: (post) => {
          addPost(post);
          onOpenChange(false);
          resetNewPost();
        },
      });
    } catch (error) {
      console.error('게시물 추가 오류:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 게시물 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
