import { createRoute } from '@tanstack/react-router';
import { Route as RootRoute } from './__root';
import AuthPage from '@/pages/auth';

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: '/signup',
  component: AuthPage,
});
