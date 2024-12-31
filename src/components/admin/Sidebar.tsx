import { useState } from 'react'
import { cn } from "../../lib/utils"
import { Button } from "../ui/button"
import {
  ChevronRight,
  LayoutDashboard,
  Car,
  CalendarClock,
  Users,
  Bell,
  MenuIcon,
} from "lucide-react"

interface SidebarProps {
  className?: string
  onTabChange: (tab: string) => void
  currentTab: string
}

export default function Sidebar({ className, onTabChange, currentTab }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'cars', label: 'Car Management', icon: Car },
    { id: 'rentals', label: 'Rental Management', icon: CalendarClock },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ]

  return (
    <div
      className={cn(
        "flex flex-col border-r transition-all duration-300",
        collapsed ? "w-16" : "w-64",
        className
      )}
    >
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && <h2 className="font-semibold">Admin Dashboard</h2>}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <MenuIcon /> : <ChevronRight />}
        </Button>
      </div>
      <nav className="flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <Button
              key={item.id}
              variant={currentTab === item.id ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-2 p-4",
                collapsed ? "justify-center" : ""
              )}
              onClick={() => onTabChange(item.id)}
            >
              <Icon size={20} />
              {!collapsed && <span>{item.label}</span>}
            </Button>
          )
        })}
      </nav>
    </div>
  )
} 