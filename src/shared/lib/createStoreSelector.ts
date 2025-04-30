import type { StoreApi, UseBoundStore } from 'zustand';
import { useShallow } from 'zustand/shallow';

/**
 * store에서 필요한 여러 상태를 골라 가져오는 selector 함수
 * @example const { posts, setPosts } = usePostsStoreSelector(['posts', 'setPosts']);
 */
export const createStoreSelector =
  <K>(store: UseBoundStore<StoreApi<K>>) =>
  <T extends keyof K>(keys: T[]) =>
    store(
      // useShallow로 리렌더링 최적화
      useShallow((state) =>
        keys.reduce(
          (acc, key) => {
            acc[key] = state[key];
            return acc;
          },
          {} as Pick<K, T>,
        ),
      ),
    );
