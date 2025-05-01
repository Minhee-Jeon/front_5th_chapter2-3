import { useQuery } from '@tanstack/react-query';
import { postsQueryKeys } from '../../config/posts/postQueryKeys';
import { postsApi } from './postsApi';
import { PostsUrlParams } from '../../lib/posts/PostUrlParams';

import type { Post } from '../../types';
import { PostsResponse } from '../../types';

/**
 * 게시글 목록 조회
 */
export const useQueryPosts = (params: PostsUrlParams) =>
  useQuery<PostsResponse>({
    queryKey: postsQueryKeys.list(params).queryKey,
    queryFn: () => {
      const searchParams = new URLSearchParams();
      for (const [key, value] of Object.entries(params)) {
        if (value) {
          searchParams.set(key, String(value));
        }
      }
      return postsApi.getPosts(searchParams.toString());
    },
    // 데이터 리로딩 시 깜빡임 방지
    placeholderData: (previousData) => previousData,
  });

/**
 * 단일 게시물 조회
 */
export const useQueryPostById = (id: number) =>
  useQuery<Post>({
    queryKey: postsQueryKeys.detail(id).queryKey,
    queryFn: () => postsApi.getPostById(id),
    // id가 존재할 때에만 요청 보내기
    enabled: Boolean(id),
  });
