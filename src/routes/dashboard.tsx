import { createRoute } from '@tanstack/react-router';
import { Route as RootRoute } from './__root';
import Dashboard from '@/pages/dashboard';

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: '/dashboard',
  component: Dashboard,
});
