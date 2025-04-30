import { type QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  client: QueryClient;
};

// App 전역에서 Tanstack을 쓸 수 있도록 컨텍스트 제공
export const QueryProvider = ({ client, children }: Props) => (
  <QueryClientProvider client={client}>
    {children}
    <ReactQueryDevtools />
  </QueryClientProvider>
);
