import * as React from "react"
import { Bell, User } from 'lucide-react'
import { CentriqLogo } from '@/components/ui/centriq-logo'

export const Navbar = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  (props, ref) => (
    <div ref={ref} className="bg-white border-b border-gray-200 px-6 py-4" {...props}>
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <CentriqLogo className="h-6" />
          </div>
          <nav className="flex items-center gap-8">
            <a href="#" className="text-blue-600 font-medium">Dashboard</a>
          </nav>
        </div>
        <div className="flex items-center gap-6">
          {/* Notification Bell with Badge */}
          <div className="relative">
            <Bell className="w-5 h-5 text-gray-600 hover:text-gray-800 cursor-pointer" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-medium">1</span>
            </div>
          </div>
          {/* User Avatar */}
          <div className="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer">
            <User className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
    </div>
  )
)

Navbar.displayName = "Navbar"