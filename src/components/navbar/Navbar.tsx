import * as React from "react"
import { Bell } from 'lucide-react'
import { CentriqLogo } from '@/components/ui/centriq-logo'

interface NavbarProps extends React.HTMLAttributes<HTMLDivElement> {
  userName?: string
}

export const Navbar = React.forwardRef<HTMLDivElement, NavbarProps>(
  ({ userName = "User", ...props }, ref) => {
    const getInitials = (name: string) => {
      return name
        .split(' ')
        .map(word => word.charAt(0).toUpperCase())
        .join('')
        .slice(0, 2); // Take only first 2 initials
    };

    return (
      <div ref={ref} className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 px-8 py-4" {...props}>
        <div className="flex items-center justify-between px-16 mx-auto" style={{ maxWidth: 'calc(100% - 40px)' }}>
          <div className="flex items-center gap-8 ml-2">
            <div className="flex items-center gap-2">
              <CentriqLogo className="h-6" />
            </div>
            <nav className="flex items-center gap-8">
              <a href="#" className="text-blue-600 font-semibold text-sm leading-5 tracking-normal">Dashboard</a>
            </nav>
          </div>
          <div className="flex items-center gap-6 mr-8">
            {/* Notification Bell with Badge */}
            <div className="relative">
              <Bell className="w-5 h-5 text-gray-600 hover:text-gray-800 cursor-pointer" />
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#E12121' }}>
                <span className="text-white text-xs font-medium">1</span>
              </div>
            </div>
            {/* User Avatar */}
            <div className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer" style={{ backgroundColor: '#3B82F8', border: '1px solid #063E98' }}>
              <span className="text-white text-xs font-semibold">{getInitials(userName)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
)

Navbar.displayName = "Navbar"