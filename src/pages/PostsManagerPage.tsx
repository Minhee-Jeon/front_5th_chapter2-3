import { useState } from 'react';
import { Edit2, Plus, ThumbsUp, Trash2 } from 'lucide-react';
import type { Post, Comment, User } from '../types';
import { useUrlParams } from '../lib/posts/useUrlParams';
import { useQueryPosts } from '../api/posts/usePostsQueries';
import { get, post, put, patch, remove } from '../shared/api/fetchBased';
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
import { HighlightedText } from '../shared/ui/HighlightedText';

import { useSelectedPostStore } from '../stores/posts/useSelectedPostStore';
import { useDialog } from '../model/dialog/useDialog';
import { useUserDialog } from '../model/dialog/useUserDialog';
import PostAddDialog from '../widgets/post/PostAddDialog';
import PostUpdateDialog from '../widgets/post/PostUpdateDialog';
import UserDialog from '../widgets/UserDialog';
import PostTable from '../widgets/post/PostTable';
import PostSearchFilter from '../widgets/post/PostSearchFilter';
import PostDetailDialog from '../widgets/post/PostDetailDialog';

const PostsManager = () => {
  const {
    skip,
    limit,
    search: searchQuery,
    tag: selectedTag,
    updateParams,
  } = useUrlParams();

  // 상태 관리
  const { setSelectedPost } = useSelectedPostStore();
  const [comments, setComments] = useState<{ [postId: number]: Comment[] }>({});
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  const [newComment, setNewComment] = useState<
    Partial<Comment> & { userId: User['id'] }
  >({
    body: '',
    postId: undefined,
    userId: 1,
  });

  const [showAddCommentDialog, setShowAddCommentDialog] = useState(false);
  const [showEditCommentDialog, setShowEditCommentDialog] = useState(false);

  const postAddDialogState = useDialog();
  const postUpdateDialogState = useDialog();
  const postDetailDialogState = useDialog();
  const userDialogState = useUserDialog();

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
  const addComment = async () => {
    try {
      const data = await post('/api/comments/add', newComment);
      setComments((prev) => ({
        ...prev,
        [data.postId]: [...(prev[data.postId] || []), data],
      }));
      setShowAddCommentDialog(false);
      setNewComment({ body: '', postId: undefined, userId: 1 });
    } catch (error) {
      console.error('댓글 추가 오류:', error);
    }
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
      setShowEditCommentDialog(false);
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
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold">댓글</h3>
        <Button
          size="sm"
          onClick={() => {
            setNewComment((prev) => ({ ...prev, postId }));
            setShowAddCommentDialog(true);
          }}
        >
          <Plus className="w-3 h-3 mr-1" />
          댓글 추가
        </Button>
      </div>
      <div className="space-y-1">
        {comments[postId]?.map((comment) => (
          <div
            key={comment.id}
            className="flex items-center justify-between text-sm border-b pb-1"
          >
            <div className="flex items-center space-x-2 overflow-hidden">
              <span className="font-medium truncate">
                {comment.user.username}:
              </span>
              <span className="truncate">
                <HighlightedText text={comment.body} highlight={searchQuery} />
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => likeComment(comment.id, postId)}
              >
                <ThumbsUp className="w-3 h-3" />
                <span className="ml-1 text-xs">{comment.likes}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedComment(comment);
                  setShowEditCommentDialog(true);
                }}
              >
                <Edit2 className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteComment(comment.id, postId)}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
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
      <BaseDialog
        open={showAddCommentDialog}
        onOpenChange={setShowAddCommentDialog}
        title="새 댓글 추가"
      >
        <Textarea
          placeholder="댓글 내용"
          value={newComment.body}
          onChange={(e) =>
            setNewComment({ ...newComment, body: e.target.value })
          }
        />
        <Button onClick={addComment}>댓글 추가</Button>
      </BaseDialog>

      {/* 댓글 수정 대화상자 */}
      <BaseDialog
        open={showEditCommentDialog}
        onOpenChange={setShowEditCommentDialog}
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
