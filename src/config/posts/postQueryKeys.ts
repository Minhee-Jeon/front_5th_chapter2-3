import { createQueryKeys } from '@lukemorales/query-key-factory';
import { postsApi } from '../../api/posts/postsApi';

// query 키 + 함수 객체 생성, query 키 + 함수를 중복 없이 재사용
export const postsQueryKeys = createQueryKeys('posts', {
  list: (params: { limit: number; skip: number }) => ({
    queryKey: [{ params }],
    queryFn: () => postsApi.getPosts(params.limit, params.skip),
  }),
  detail: (id: number) => ({
    queryKey: [id],
    queryFn: () => postsApi.getPostById(id),
  }),
});
