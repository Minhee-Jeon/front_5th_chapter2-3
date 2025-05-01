import { useDeletePost } from '../../api/posts/usePostsMutations';
import { useUrlParams } from '../../lib/posts/useUrlParams';
import { useQueryPostsWithUsers } from '../../features/posts/api/usePostsQueries';
import { useSelectedPostStoreSelector } from '../../features/posts/model/useSelectedPostStore';
import { useCommentsStoreSelector } from '../../features/comments/model/useCommentsStore';
import { Post } from '../../entities/posts/model/Post';
import { User } from '../../types';
import {
  Edit2,
  MessageSquare,
  ThumbsDown,
  ThumbsUp,
  Trash2,
} from 'lucide-react';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../shared/ui';
import { HighlightedText } from '../../shared/ui/HighlightedText';

interface Props {
  onUserClick: (user: User) => void;
  onPostUpdateDialogOpen: () => void;
  onPostDetailDialogOpen: () => void;
}

export default function PostTable({
  onUserClick,
  onPostUpdateDialogOpen,
  onPostDetailDialogOpen,
}: Props) {
  const { setSelectedPost } = useSelectedPostStoreSelector(['setSelectedPost']);
  const { getComments } = useCommentsStoreSelector(['getComments']);
  const { updateParams, ...params } = useUrlParams();
  const { data: posts, isLoading } = useQueryPostsWithUsers({ ...params });
  const { mutateAsync: mutatePostDelete } = useDeletePost();

  // 게시물 삭제
  const handleDeletePost = async (id: number) => {
    try {
      await mutatePostDelete(id);
    } catch (error) {
      console.error('게시물 삭제 오류:', error);
    }
  };

  // 게시물 상세 보기
  const handleOpenPostDetail = (post: Post) => {
    setSelectedPost(post);
    getComments(post.id);
    onPostDetailDialogOpen();
  };

  // 태그 선택
  const handleSelectTag = (tag: string) => {
    updateParams({ tag });
  };

  if (isLoading) {
    return <div className="flex justify-center p-4">로딩 중...</div>;
  }

  return (
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
        {posts?.map((post) => (
          <TableRow key={post.id}>
            <TableCell>{post.id}</TableCell>
            <TableCell>
              <div className="space-y-1">
                <div>
                  <HighlightedText
                    text={post.title}
                    highlight={params.search}
                  />
                </div>
                <div className="flex flex-wrap gap-1">
                  {post.tags?.map((tag) => (
                    <span
                      key={tag}
                      className={`px-1 text-[9px] font-semibold rounded-[4px] cursor-pointer ${
                        params.tag === tag
                          ? 'text-white bg-blue-500 hover:bg-blue-600'
                          : 'text-blue-800 bg-blue-100 hover:bg-blue-200'
                      }`}
                      onClick={() => {
                        handleSelectTag(tag);
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
                onClick={() => onUserClick(post.author!)}
                onKeyUp={(e) => e.key === 'Enter' && onUserClick(post.author!)}
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
                  onClick={() => handleOpenPostDetail(post)}
                >
                  <MessageSquare className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedPost(post);
                    onPostUpdateDialogOpen();
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
}
