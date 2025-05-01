import { useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { PostsUrlParams } from './PostUrlParams';

/**
 * URL 쿼리 파라미터를 처리하는 훅
 * @example
 * const { skip, limit, search, sortBy, sortOrder, tag, updateParams } = useUrlParams();
 * updateParams({ skip: 10, limit: 20 });
 */
export const useUrlParams = (defaultParams: Partial<PostsUrlParams> = {}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getParams = useCallback(() => {
    const params = new URLSearchParams(location.search);
    return {
      skip: Number(params.get('skip') || defaultParams.skip || '0'),
      limit: Number(params.get('limit') || defaultParams.limit || '10'),
      search: params.get('search') || defaultParams.search || '',
      sortBy: params.get('sortBy') || defaultParams.sortBy || '',
      sortOrder: (params.get('sortOrder') ||
        defaultParams.sortOrder ||
        'asc') as 'asc' | 'desc',
      tag: params.get('tag') || defaultParams.tag || '',
    };
  }, [location.search, defaultParams]);

  const updateParams = useCallback(
    (newParams: Partial<PostsUrlParams>) => {
      const params = new URLSearchParams(location.search);
      for (const [key, value] of Object.entries(newParams)) {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        value ? params.set(key, value.toString()) : params.delete(key);
      }
      navigate(`?${params.toString()}`);
    },
    [navigate, location.search],
  );

  const currentParams = useMemo(() => getParams(), [getParams]);

  return {
    ...currentParams,
    updateParams,
  };
};
