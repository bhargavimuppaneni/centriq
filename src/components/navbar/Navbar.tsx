import * as React from "react"
import { Bell } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { CentriqLogo } from '@/components/ui/centriq-logo'
import { UserProfileDropdown } from '@/features/user-management'

interface NavbarProps extends React.HTMLAttributes<HTMLDivElement> {
  userName?: string
  userEmail?: string
}

export const Navbar = React.forwardRef<HTMLDivElement, NavbarProps>(
  ({ userName = "User", userEmail = "user@example.com", ...props }, ref) => {
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false)
    const navigate = useNavigate()

    const getInitials = (name: string) => {
      return name
        .split(' ')
        .map(word => word.charAt(0).toUpperCase())
        .join('')
        .slice(0, 2); // Take only first 2 initials
    };

    const handleUserAccountClick = () => {
      console.log('User Account clicked')
      setIsDropdownOpen(false)
    }

    const handleHelpSupportClick = () => {
      console.log('Help & Support clicked')
      setIsDropdownOpen(false)
    }

    const handleAccountManagementClick = () => {
      navigate({ to: '/account' })
      setIsDropdownOpen(false)
    }

    const handleLogoutClick = () => {
      console.log('Logout clicked')
      setIsDropdownOpen(false)
    }

    return (
      <div ref={ref} className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 px-8 py-4" {...props}>
        <div className="flex items-center justify-between px-16 mx-auto" style={{ maxWidth: 'calc(100% - 40px)' }}>
          <div className="flex items-center gap-8 ml-2">
            <div className="flex items-center gap-2">
              <div 
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => navigate({ to: '/campaign' })}
              >
                <CentriqLogo className="h-6" />
              </div>
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
            {/* User Avatar with Dropdown */}
            <div className="relative">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity" 
                style={{ backgroundColor: '#3B82F8', border: '1px solid #063E98' }}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span className="text-white text-xs font-semibold">{getInitials(userName)}</span>
              </div>
              
              <UserProfileDropdown
                userName={userName}
                userEmail={userEmail}
                isOpen={isDropdownOpen}
                onClose={() => setIsDropdownOpen(false)}
                onUserAccountClick={handleUserAccountClick}
                onHelpSupportClick={handleHelpSupportClick}
                onAccountManagementClick={handleAccountManagementClick}
                onLogoutClick={handleLogoutClick}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
)

Navbar.displayName = "Navbar"