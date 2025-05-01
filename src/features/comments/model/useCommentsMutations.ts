import { commentsApi } from '../../../entities/comments/api/commentsApi';
import type { Comment } from '../../types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: commentsApi.createComment,
    onSuccess: (newComment) => {
      queryClient.setQueryData<Comment[]>(
        ['comments', newComment.postId],
        (oldData = []) => [...oldData, newComment],
      );
    },
  });
};

export const useUpdateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: commentsApi.updateComment,
    onSuccess: (updatedComment) => {
      queryClient.setQueryData<Comment[]>(
        ['comments', updatedComment.postId],
        (oldData = []) =>
          oldData.map((comment) =>
            comment.id === updatedComment.id
              ? { ...comment, ...updatedComment }
              : comment,
          ),
      );
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: commentsApi.deleteComment,
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData<Comment[]>(['comments'], (oldData = []) =>
        oldData.filter((comment) => comment.id !== deletedId),
      );
    },
  });
};
