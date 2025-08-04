import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Navbar } from '@/components/navbar';

// we can add our navbar and footer here

export const Route = createRootRoute({
  component: () => (
    <>
      <Navbar userName="John Doe" userEmail="john.doe@example.com" />
      <div className="pt-16 transition-all duration-900 ease-in-out"> {/* Added smooth transition for page changes */}
        <Outlet />
      </div>
      {process.env.NODE_ENV === 'development' && <TanStackRouterDevtools />}
    </>
  ),
})