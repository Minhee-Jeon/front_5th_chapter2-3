import { useQueryClient, useMutation } from '@tanstack/react-query';

import { postsApi } from './postsApi';
import type { Post } from '../../types';

import { postsQueryKeys } from '../../config/posts/postQueryKeys';

export const useAddPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Pick<Post, 'title' | 'body' | 'userId'>) =>
      postsApi.addPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: postsQueryKeys.list._def,
      });
    },
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (post: Post) => postsApi.updatePost(post),
    onSuccess: (updatedPost) => {
      queryClient.setQueryData(
        postsQueryKeys.detail(updatedPost.id).queryKey,
        updatedPost,
      );
      queryClient.invalidateQueries({
        queryKey: postsQueryKeys.list._def,
      });
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => postsApi.deletePost(id),
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({
        queryKey: postsQueryKeys.detail(deletedId).queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: postsQueryKeys.list._def,
      });
    },
  });
};
