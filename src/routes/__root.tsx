import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Navbar } from '@/components/navbar';

// we can add our navbar and footer here

export const Route = createRootRoute({
  component: () => (
    <>
      <Navbar userName="John Doe" />
      <div className="pt-16"> {/* Increased padding to account for navbar height */}
        <Outlet />
      </div>
      {process.env.NODE_ENV === 'development' && <TanStackRouterDevtools />}
    </>
  ),
})