import { useEffect, useState } from 'react';
import {
  Edit2,
  MessageSquare,
  Plus,
  Search,
  ThumbsDown,
  ThumbsUp,
  Trash2,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import type {
  Post,
  Comment,
  User,
  Tag,
  PostsResponse,
  UsersResponse,
} from '../types';
import { useDeletePost } from '../api/posts/usePostsMutations';
import { usePostsStoreSelector } from '../stores/posts/usePostsStore';
import { useQueryPosts } from '../api/posts/usePostsQueries';
import { useQueryUsers } from '../api/users/useUsersQueries';
import { get, post, put, patch, remove } from '../shared/api/fetchBased';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Textarea,
} from '../shared/ui';
import { BaseDialog } from '../widgets/ui/BaseDialog';
import { HighlightedText } from '../shared/ui/HighlightedText';

import { useSelectedPostStore } from '../stores/posts/useSelectedPostStore';
import { usePostAddDialog } from '../model/dialog/usePostDialog';
import { usePostUpdateDialog } from '../model/dialog/usePostDialog';
import { useUserDialog } from '../model/dialog/useUserDialog';
import PostAddDialog from '../widgets/post/PostAddDialog';
import PostUpdateDialog from '../widgets/post/PostUpdateDialog';
import UserDialog from '../widgets/UserDialog';

const PostsManager = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  // 상태 관리
  const { posts, setPosts, deletePost } = usePostsStoreSelector([
    'posts',
    'setPosts',
    'deletePost',
  ]);
  const [total, setTotal] = useState(0);
  const [skip, setSkip] = useState(parseInt(queryParams.get('skip') || '0'));
  const [limit, setLimit] = useState(
    parseInt(queryParams.get('limit') || '10'),
  );
  const [searchQuery, setSearchQuery] = useState(
    queryParams.get('search') || '',
  );
  const { selectedPost, setSelectedPost } = useSelectedPostStore();
  const [sortBy, setSortBy] = useState(queryParams.get('sortBy') || '');
  const [sortOrder, setSortOrder] = useState(
    queryParams.get('sortOrder') || 'asc',
  );
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTag, setSelectedTag] = useState(queryParams.get('tag') || '');
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
  const [showPostDetailDialog, setShowPostDetailDialog] = useState(false);

  const { dialog: postAddDialogState } = usePostAddDialog();
  const { dialog: postUpdateDialogState } = usePostUpdateDialog();
  const userDialogState = useUserDialog();

  // post 관련 hook
  const {
    data: postsData,
    isLoading: postsLoading,
    error: postsError,
  } = useQueryPosts(limit, skip);
  const { mutateAsync: mutatePostDelete } = useDeletePost();

  const {
    data: usersData,
    isLoading: usersLoading,
    error: usersError,
  } = useQueryUsers();

  // URL 업데이트 함수
  const updateURL = () => {
    const params = new URLSearchParams();
    if (skip) params.set('skip', skip.toString());
    if (limit) params.set('limit', limit.toString());
    if (searchQuery) params.set('search', searchQuery);
    if (sortBy) params.set('sortBy', sortBy);
    if (sortOrder) params.set('sortOrder', sortOrder);
    if (selectedTag) params.set('tag', selectedTag);
    navigate(`?${params.toString()}`);
  };

  // 게시물 가져오기
  const fetchPosts = () => {
    setLoading(true);

    if (postsLoading || usersLoading) return;
    if (postsError) {
      console.error('게시물 가져오기 오류: ', postsError);
      return;
    }
    if (usersError) {
      console.error('사용자 정보 가져오기 오류: ', postsError);
      return;
    }
    if (!postsData || !usersData) return;

    const postsWithUsers = postsData.posts.map((post) => ({
      ...post,
      author: usersData.users.find((user) => user.id === post.userId),
    }));
    setPosts(postsWithUsers);
    setTotal(postsData.total);
  };

  // 태그 가져오기
  const fetchTags = async () => {
    try {
      const data = await get('/api/posts/tags');
      setTags(data);
    } catch (error) {
      console.error('태그 가져오기 오류:', error);
    }
  };

  // 게시물 검색
  const searchPosts = async () => {
    if (!searchQuery) {
      fetchPosts();
      return;
    }
    setLoading(true);
    try {
      const data = await get(`/api/posts/search?q=${searchQuery}`);
      setPosts(data.posts);
      setTotal(data.total);
    } catch (error) {
      console.error('게시물 검색 오류:', error);
    }
    setLoading(false);
  };

  // 태그별 게시물 가져오기
  const fetchPostsByTag = async (tag: string) => {
    if (!tag || tag === 'all') {
      fetchPosts();
      return;
    }
    setLoading(true);
    try {
      const [postsResponse, usersResponse] = await Promise.all([
        get(`/api/posts/tag/${tag}`),
        get('/api/users?limit=0&select=username,image'),
      ]);
      const postsData: PostsResponse = await postsResponse;
      const usersData: UsersResponse = await usersResponse;

      const postsWithUsers = postsData.posts.map((post) => ({
        ...post,
        author: usersData.users.find((user) => user.id === post.userId),
      }));

      setPosts(postsWithUsers);
      setTotal(postsData.total);
    } catch (error) {
      console.error('태그별 게시물 가져오기 오류:', error);
    }
    setLoading(false);
  };

  // 게시물 삭제
  const handleDeletePost = async (id: number) => {
    try {
      // await postsApi.deletePost(id);
      // deletePost(id);
      mutatePostDelete(id, {
        onSuccess: () => {
          deletePost(id);
        },
      });
    } catch (error) {
      console.error('게시물 삭제 오류:', error);
    }
  };

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
  const openPostDetail = (post: Post) => {
    setSelectedPost(post);
    fetchComments(post.id);
    setShowPostDetailDialog(true);
  };

  useEffect(() => {
    fetchTags();
  }, []);

  useEffect(() => {
    if (selectedTag) {
      fetchPostsByTag(selectedTag);
    } else {
      fetchPosts();
    }
    updateURL();
  }, [skip, limit, sortBy, sortOrder, selectedTag]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSkip(parseInt(params.get('skip') || '0'));
    setLimit(parseInt(params.get('limit') || '10'));
    setSearchQuery(params.get('search') || '');
    setSortBy(params.get('sortBy') || '');
    setSortOrder(params.get('sortOrder') || 'asc');
    setSelectedTag(params.get('tag') || '');
  }, [location.search]);

  useEffect(() => {
    if (postsData && usersData) {
      setTotal(postsData.total);
      const postsWithUsers = postsData.posts.map((post) => ({
        ...post,
        author: usersData?.users?.find((user) => user.id === post.userId),
      }));
      setPosts(postsWithUsers);
      setLoading(false);
    }
  }, [postsData, usersData, setPosts]);

  // 게시물 테이블 렌더링
  const renderPostTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">ID</TableHead>
          <TableHead>제목</TableHead>
          <TableHead className="w-[150px]">작성자</TableHead>
          <TableHead className="w-[150px]">반응</TableHead>
          <TableHead className="w-[150px]">작업</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts.map((post) => (
          <TableRow key={post.id}>
            <TableCell>{post.id}</TableCell>
            <TableCell>
              <div className="space-y-1">
                <div>
                  <HighlightedText text={post.title} highlight={searchQuery} />
                </div>
                <div className="flex flex-wrap gap-1">
                  {post.tags?.map((tag) => (
                    <span
                      key={tag}
                      className={`px-1 text-[9px] font-semibold rounded-[4px] cursor-pointer ${
                        selectedTag === tag
                          ? 'text-white bg-blue-500 hover:bg-blue-600'
                          : 'text-blue-800 bg-blue-100 hover:bg-blue-200'
                      }`}
                      onClick={() => {
                        setSelectedTag(tag);
                        updateURL();
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div
                className="flex items-center space-x-2 cursor-pointer"
                onClick={() => userDialogState.onOpenUserDialog(post.author!)}
              >
                <img
                  src={post.author?.image}
                  alt={post.author?.username}
                  className="w-8 h-8 rounded-full"
                />
                <span>{post.author?.username}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <ThumbsUp className="w-4 h-4" />
                <span>{post.reactions?.likes || 0}</span>
                <ThumbsDown className="w-4 h-4" />
                <span>{post.reactions?.dislikes || 0}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openPostDetail(post)}
                >
                  <MessageSquare className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedPost(post);
                    postUpdateDialogState.open();
                  }}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeletePost(post.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

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
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="게시물 검색..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && searchPosts()}
                />
              </div>
            </div>
            <Select
              value={selectedTag}
              onValueChange={(value) => {
                setSelectedTag(value);
                fetchPostsByTag(value);
                updateURL();
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="태그 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 태그</SelectItem>
                {tags.map((tag) => (
                  <SelectItem key={tag.url} value={tag.slug}>
                    {tag.slug}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="정렬 기준" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">없음</SelectItem>
                <SelectItem value="id">ID</SelectItem>
                <SelectItem value="title">제목</SelectItem>
                <SelectItem value="reactions">반응</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="정렬 순서" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">오름차순</SelectItem>
                <SelectItem value="desc">내림차순</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 게시물 테이블 */}
          {loading ? (
            <div className="flex justify-center p-4">로딩 중...</div>
          ) : (
            renderPostTable()
          )}

          {/* 페이지네이션 */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span>표시</span>
              <Select
                value={limit.toString()}
                onValueChange={(value) => setLimit(Number(value))}
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
                onClick={() => setSkip(Math.max(0, skip - limit))}
              >
                이전
              </Button>
              <Button
                disabled={skip + limit >= total}
                onClick={() => setSkip(skip + limit)}
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
      <BaseDialog
        open={showPostDetailDialog}
        onOpenChange={setShowPostDetailDialog}
        title={
          selectedPost?.title && (
            <HighlightedText
              text={selectedPost?.title}
              highlight={searchQuery}
            />
          )
        }
      >
        <p>
          {selectedPost?.body && (
            <HighlightedText
              text={selectedPost?.body}
              highlight={searchQuery}
            />
          )}
        </p>
        {selectedPost?.id ? renderComments(selectedPost?.id) : null}
      </BaseDialog>

      {/* 사용자 모달 */}
      <UserDialog state={userDialogState} />
    </Card>
  );
};

export default PostsManager;
