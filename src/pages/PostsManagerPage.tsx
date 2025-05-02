import { Plus } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle } from '../shared/ui';

import { useDialog } from '../features/dialog/model/useDialog';
import { useUserDialog } from '../features/dialog/model/useUserDialog';

import PostAddDialog from '../widgets/post/PostAddDialog';
import PostUpdateDialog from '../widgets/post/PostUpdateDialog';
import UserDialog from '../widgets/user/UserDialog';
import PostTable from '../widgets/post/PostTable';
import PostSearchFilter from '../features/posts/ui/PostSearchFilter';
import PostDetailDialog from '../widgets/post/PostDetailDialog';
import PostPagination from '../features/posts/ui/PostPagination';
import CommentAddDialog from '../widgets/comments/CommentAddDialog';
import { CommentList } from '../features/comments/ui/CommentList';
import CommentEditDialog from '../widgets/comments/CommentEditDialog';

const PostsManager = () => {
  const postAddDialogState = useDialog();
  const postUpdateDialogState = useDialog();
  const postDetailDialogState = useDialog();
  const userDialogState = useUserDialog();
  const commentAddDialogState = useDialog();
  const commentEditDialogState = useDialog();

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>게시물 관리자</span>
          <Button onClick={() => postAddDialogState.open()}>
            <Plus className="w-4 h-4 mr-2" />
            게시물 추가
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {/* 검색 및 필터 컨트롤 */}
          <PostSearchFilter />

          {/* 게시물 테이블 */}
          <PostTable
            onUserClick={userDialogState.onOpenUserDialog}
            onPostUpdateDialogOpen={postUpdateDialogState.open}
            onPostDetailDialogOpen={postDetailDialogState.open}
          />

          {/* 페이지네이션 */}
          <PostPagination />
        </div>
      </CardContent>

      {/* 게시물 추가 대화상자 */}
      <PostAddDialog state={postAddDialogState} />
      {/* 게시물 수정 대화상자 */}
      <PostUpdateDialog state={postUpdateDialogState} />

      {/* 댓글 추가 대화상자 */}
      <CommentAddDialog state={commentAddDialogState} />
      {/* 댓글 수정 대화상자 */}
      <CommentEditDialog state={commentEditDialogState} />

      {/* 게시물 상세 보기 대화상자 */}
      <PostDetailDialog
        state={postDetailDialogState}
        renderComments={(postId: number) => (
          <CommentList
            postId={postId}
            commentAddDialogState={commentAddDialogState}
            commentEditDialogState={commentEditDialogState}
          />
        )}
      />
      {/* 사용자 모달 */}
      <UserDialog state={userDialogState} />
    </Card>
  );
};

export default PostsManager;
