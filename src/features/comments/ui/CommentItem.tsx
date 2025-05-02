import type { Comment } from '../../../entities/comments/model/Comment';
import { useUrlParams } from '../../posts/lib/useUrlParams';
import { Edit2, ThumbsUp, Trash2 } from 'lucide-react';
import { Button } from '../../../shared/ui';
import { HighlightedText } from '../../../shared/ui/HighlightedText';

interface Props {
  comment: Comment;
  postId: number;
  onLike: (commentId: number, postId: number) => void;
  onDelete: (commentId: number, postId: number) => Promise<void>;
  onCommentEditDialogOpen: () => void;
}

export default function CommentItem({
  comment,
  postId,
  onLike,
  onDelete,
  onCommentEditDialogOpen,
}: Props) {
  const searchQuery = useUrlParams().search;

  return (
    <div
      key={comment.id}
      className="flex items-center justify-between text-sm border-b pb-1"
    >
      <div className="flex items-center space-x-2 overflow-hidden">
        <span className="font-medium truncate">{comment.user.username}:</span>
        <span className="truncate">
          <HighlightedText text={comment.body} highlight={searchQuery} />
        </span>
      </div>
      <div className="flex items-center space-x-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onLike(comment.id, postId)}
        >
          <ThumbsUp className="w-3 h-3" />
          <span className="ml-1 text-xs">{comment.likes}</span>
        </Button>
        <Button variant="ghost" size="sm" onClick={onCommentEditDialogOpen}>
          <Edit2 className="w-3 h-3" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(comment.id, postId)}
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}
