import { useState } from 'react';
import { Plus } from 'lucide-react';
import type { Post, Comment } from '../types';
import { useUrlParams } from '../lib/posts/useUrlParams';
import { useQueryPosts } from '../api/posts/usePostsQueries';
import { get, put, patch, remove } from '../shared/api/fetchBased';
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
  Textarea,
} from '../shared/ui';
import { BaseDialog } from '../widgets/ui/BaseDialog';

import { useSelectedPostStore } from '../stores/posts/useSelectedPostStore';
import { useNewCommentStoreSelector } from '../stores/comments/useNewCommentStore';
import { useDialog } from '../model/dialog/useDialog';
import { useUserDialog } from '../model/dialog/useUserDialog';

import PostAddDialog from '../widgets/post/PostAddDialog';
import PostUpdateDialog from '../widgets/post/PostUpdateDialog';
import UserDialog from '../widgets/UserDialog';
import PostTable from '../widgets/post/PostTable';
import PostSearchFilter from '../widgets/post/PostSearchFilter';
import PostDetailDialog from '../widgets/post/PostDetailDialog';
import CommentAdd from '../widgets/comments/ComentAdd';
import CommentItem from '../widgets/comments/CommentItem';
import CommentAddDialog from '../widgets/comments/CommentAddDialog';

const PostsManager = () => {
  const {
    skip,
    limit,
    search: searchQuery,
    tag: selectedTag,
    updateParams,
  } = useUrlParams();

  // 상태 관리
  const { selectedPost, setSelectedPost } = useSelectedPostStore();
  const [comments, setComments] = useState<{ [postId: number]: Comment[] }>({});
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  const { newComment, updateNewComment } = useNewCommentStoreSelector([
    'newComment',
    'updateNewComment',
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

  // 댓글 추가
  const onCommentAdd = async () => {
    commentAddDialogState.open();
    updateNewComment({ ...newComment, postId: selectedPost?.id });
  };

  // 댓글 업데이트
  const updateComment = async () => {
    try {
      const data = await put(`/api/comments/${selectedComment?.id}`, {
        body: selectedComment?.body,
      });
      setComments((prev) => ({
        ...prev,
        [data.postId]: prev[data.postId].map((comment) =>
          comment.id === data.id ? data : comment,
        ),
      }));
      commentEditDialogState.close();
    } catch (error) {
      console.error('댓글 업데이트 오류:', error);
    }
  };

  // 댓글 삭제
  const deleteComment = async (id: number, postId: number) => {
    try {
      await remove(`/api/comments/${id}`);
      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId].filter((comment) => comment.id !== id),
      }));
    } catch (error) {
      console.error('댓글 삭제 오류:', error);
    }
  };

  // 댓글 좋아요
  const likeComment = async (id: number, postId: number) => {
    try {
      const comment = comments[postId].find((c) => c.id === id);
      if (!comment) return;

      const data = await patch(`/api/comments/${id}`, {
        likes: (comment?.likes || 0) + 1,
      });
      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId].map((comment) =>
          comment.id === data.id
            ? { ...data, likes: comment.likes + 1 }
            : comment,
        ),
      }));
    } catch (error) {
      console.error('댓글 좋아요 오류:', error);
    }
  };

  // 게시물 상세 보기
  const openPostDetailOpen = (post: Post) => {
    setSelectedPost(post);
    fetchComments(post.id);
    postDetailDialogState.open();
  };

  // 댓글 렌더링
  const renderComments = (postId: number) => (
    <div className="mt-2">
      <CommentAdd onCommentAdd={onCommentAdd} />
      <div className="space-y-1">
        {comments[postId]?.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onCommentEditDialogOpen={() => {
              setSelectedComment(comment);
              commentEditDialogState.open();
            }}
            onDelete={deleteComment}
            onLike={likeComment}
            postId={postId}
          />
        ))}
      </div>
    </div>
  );

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
      <BaseDialog
        open={commentEditDialogState.isOpen}
        onOpenChange={commentEditDialogState.close}
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
        <Button onClick={updateComment}>댓글 업데이트</Button>
      </BaseDialog>

      {/* 게시물 상세 보기 대화상자 */}
      <PostDetailDialog
        state={postDetailDialogState}
        renderComments={renderComments}
      />

      {/* 사용자 모달 */}
      <UserDialog state={userDialogState} />
    </Card>
  );
};

export default PostsManager;
