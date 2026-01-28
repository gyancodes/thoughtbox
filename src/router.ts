import { createRouter } from '@tanstack/react-router';
import { Route as rootRoute } from './routes/__root';

// Import all routes
import { Route as indexRoute } from './routes/index';

// Create the router instance
const router = createRouter({
  routeTree: rootRoute.addChildren([indexRoute]),
  defaultPreload: 'intent',
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export { router };
