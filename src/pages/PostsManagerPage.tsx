import { Plus } from 'lucide-react';
import type { Post } from '../types';
import { useUrlParams } from '../lib/posts/useUrlParams';
import { useQueryPosts } from '../api/posts/usePostsQueries';
import { get } from '../shared/api/fetchBased';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../shared/ui';

import { useSelectedPostStoreSelector } from '../stores/posts/useSelectedPostStore';
import { useCommentsStoreSelector } from '../stores/comments/useCommentsStore';
import { useDialog } from '../model/dialog/useDialog';
import { useUserDialog } from '../model/dialog/useUserDialog';

import PostAddDialog from '../widgets/post/PostAddDialog';
import PostUpdateDialog from '../widgets/post/PostUpdateDialog';
import UserDialog from '../widgets/UserDialog';
import PostTable from '../widgets/post/PostTable';
import PostSearchFilter from '../widgets/post/PostSearchFilter';
import PostDetailDialog from '../widgets/post/PostDetailDialog';
import CommentAddDialog from '../widgets/comments/CommentAddDialog';
import { CommentList } from '../widgets/comments/CommentList';
import CommentEditDialog from '../widgets/comments/CommentEditDialog';

const PostsManager = () => {
  const {
    skip,
    limit,
    search: searchQuery,
    tag: selectedTag,
    updateParams,
  } = useUrlParams();

  // 상태 관리
  const { setSelectedPost } = useSelectedPostStoreSelector(['setSelectedPost']);
  const { comments, setComments } = useCommentsStoreSelector([
    'comments',
    'setComments',
  ]);

  const postAddDialogState = useDialog();
  const postUpdateDialogState = useDialog();
  const postDetailDialogState = useDialog();
  const userDialogState = useUserDialog();
  const commentAddDialogState = useDialog();
  const commentEditDialogState = useDialog();

  // post 데이터 가져오기
  const { data: postsData, isLoading: loading } = useQueryPosts({
    limit,
    skip,
    search: searchQuery,
    tag: selectedTag,
  });

  // 댓글 가져오기
  const fetchComments = async (postId: number) => {
    if (comments[postId]) return; // 이미 불러온 댓글이 있으면 다시 불러오지 않음
    try {
      const data = await get(`/api/comments/post/${postId}`);
      setComments((prev) => ({ ...prev, [postId]: data.comments }));
    } catch (error) {
      console.error('댓글 가져오기 오류:', error);
    }
  };

  // 게시물 상세 보기
  const openPostDetailOpen = (post: Post) => {
    setSelectedPost(post);
    fetchComments(post.id);
    postDetailDialogState.open();
  };

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
          {loading ? (
            <div className="flex justify-center p-4">로딩 중...</div>
          ) : (
            <PostTable
              onUserClick={userDialogState.onOpenUserDialog}
              onPostDetail={openPostDetailOpen}
              onPostUpdateDialogOpen={postUpdateDialogState.open}
            />
          )}

          {/* 페이지네이션 */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span>표시</span>
              <Select
                value={limit.toString()}
                onValueChange={(value) =>
                  updateParams({ limit: Number(value) })
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="30">30</SelectItem>
                </SelectContent>
              </Select>
              <span>항목</span>
            </div>
            <div className="flex gap-2">
              <Button
                disabled={skip === 0}
                onClick={() =>
                  updateParams({ skip: Math.max(0, skip - limit) })
                }
              >
                이전
              </Button>
              <Button
                disabled={skip + limit >= (postsData?.total ?? 0)}
                onClick={() => updateParams({ skip: skip + limit })}
              >
                다음
              </Button>
            </div>
          </div>
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
