import * as React from "react"
import { Settings, HelpCircle, User, LogOut } from 'lucide-react'

interface UserProfileDropdownProps {
  userName?: string
  userEmail?: string
  isOpen: boolean
  onClose: () => void
  onUserAccountClick?: () => void
  onHelpSupportClick?: () => void
  onAccountManagementClick?: () => void
  onLogoutClick?: () => void
}

export const UserProfileDropdown: React.FC<UserProfileDropdownProps> = ({ 
  userName = "User", 
  userEmail = "user@example.com",
  isOpen,
  onClose,
  onUserAccountClick,
  onHelpSupportClick,
  onAccountManagementClick,
  onLogoutClick,
  ...props 
}) => {
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div 
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
      {...props}
    >
      {/* User Info Header */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold" style={{ backgroundColor: '#3B82F8' }}>
            {userName.split(' ').map(word => word.charAt(0).toUpperCase()).join('').slice(0, 2)}
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">{userName}</p>
            <p className="text-gray-500 text-xs">{userEmail}</p>
          </div>
        </div>
      </div>

      {/* Account Section */}
      <div className="py-2">
        <p className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">Account</p>
        
        <button
          onClick={onUserAccountClick}
          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <Settings className="w-4 h-4" />
          User Account
        </button>

        <button
          onClick={onHelpSupportClick}
          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <HelpCircle className="w-4 h-4" />
          Help & Support
        </button>

        <button
          onClick={onAccountManagementClick}
          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 active:bg-blue-100 transition-all duration-200 cursor-pointer group"
        >
          <User className="w-4 h-4 group-hover:text-blue-600 transition-colors" />
          Account Management
        </button>
      </div>

      {/* Logout Section */}
      <div className="border-t border-gray-100 py-2">
        <button
          onClick={onLogoutClick}
          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Log out
        </button>
      </div>
    </div>
  )
}

UserProfileDropdown.displayName = "UserProfileDropdown"