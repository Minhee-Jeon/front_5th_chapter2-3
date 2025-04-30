import { useQuery } from '@tanstack/react-query';
import { postsQueryKeys } from '../../config/posts/postQueryKeys';

import type { Post } from '../../types';
import { PostsResponse } from '../../types';

/**
 * 게시글 목록 조회
 */
export const useQueryPosts = (limit: number, skip: number) =>
  useQuery<
    PostsResponse,
    Error,
    PostsResponse,
    readonly ['posts', 'list', { params: { limit: number; skip: number } }]
  >({
    ...postsQueryKeys.list({ limit, skip }),
    // 데이터 리로딩 시 깜빡임 방지
    placeholderData: (previousData) => previousData,
  });

/**
 * 단일 게시물 조회
 */
export const useQueryPostById = (id: number) =>
  useQuery<Post, Error, Post, readonly ['posts', 'detail', number]>({
    ...postsQueryKeys.detail(id),
    // id가 존재할 때에만 요청 보내기
    enabled: Boolean(id),
  });
