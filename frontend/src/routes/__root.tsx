import { QueryClientProvider } from '@tanstack/react-query';
import { Outlet, createRootRoute } from '@tanstack/react-router';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '#/contexts/auth';
import { SocketProvider } from '#/contexts/socket';
import { queryClient } from '#/lib/query-client';

import '../styles.css';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SocketProvider>
          <Outlet />
          <Toaster
            position="top-right"
            toastOptions={{
              custom: { duration: 4000 },
            }}
            containerStyle={{ top: 16, right: 16 }}
          />
        </SocketProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
