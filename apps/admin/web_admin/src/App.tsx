import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Navigate, createHashRouter, RouterProvider } from 'react-router-dom';
import { RequireAuth } from './components/RequireAuth';
import { AdminLayout } from './components/Layout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { UsersPage } from './pages/UsersPage';
import { PostsPage } from './pages/PostsPage';
import { PostFormPage } from './pages/PostFormPage';
import { AnnouncementsPage } from './pages/AnnouncementsPage';
import { AnnouncementFormPage } from './pages/AnnouncementFormPage';
import { CommentsPage } from './pages/CommentsPage';
import { ReportsPage } from './pages/ReportsPage';
import { AuditPage } from './pages/AuditPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const router = createHashRouter([
  { path: '/login', element: <LoginPage /> },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'users', element: <UsersPage /> },
          { path: 'posts', element: <PostsPage /> },
          { path: 'posts/new', element: <PostFormPage /> },
          { path: 'posts/:id/edit', element: <PostFormPage /> },
          { path: 'announcements', element: <AnnouncementsPage /> },
          { path: 'announcements/new', element: <AnnouncementFormPage /> },
          { path: 'announcements/:id/edit', element: <AnnouncementFormPage /> },
          { path: 'comments', element: <CommentsPage /> },
          { path: 'reports', element: <ReportsPage /> },
          { path: 'audit', element: <AuditPage /> },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
]);

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}