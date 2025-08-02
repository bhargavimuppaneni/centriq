import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Navbar } from '@/components/navbar';

// we can add our navbar and footer here

export const Route = createRootRoute({
  component: () => (
    <>
      <Navbar userName="John Doe" />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
})