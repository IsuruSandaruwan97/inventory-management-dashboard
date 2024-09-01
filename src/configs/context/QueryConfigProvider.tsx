import { persister, queryClient } from '@configs/react-query.config';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { ReactNode } from 'react';

export default function QueryConfigProvider({ children }: { children: ReactNode }) {
  return (
    <PersistQueryClientProvider client={queryClient} persistOptions={{ persister }}>
      {children}
    </PersistQueryClientProvider>
  );
}
