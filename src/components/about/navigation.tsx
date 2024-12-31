import { Link } from 'react-router-dom'
import { Button } from "@/components/ui/button"

export function Navigation() {
  return (
    <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm z-50 border-b">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="font-bold text-xl">
        RoadReady.
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/service" className="text-sm font-medium">
            Service
          </Link>
          <Link to="/cars" className="text-sm font-medium">
            Cars
          </Link>
          <Link to="/pricing" className="text-sm font-medium">
            Pricing
          </Link>
          <Link to="/about" className="text-sm font-medium">
            About
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link to="/contact" className="text-sm font-medium text-red-500">
            Contact
          </Link>
          <Button size="sm" className="bg-red-500 hover:bg-red-600">
            Sign up
          </Button>
        </div>
      </div>
    </header>
  )
}

