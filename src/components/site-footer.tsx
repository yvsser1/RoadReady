import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Link } from "react-router-dom"
import { Facebook, Twitter, Instagram } from 'lucide-react'

export function SiteFooter() {
  return (
    <footer className="border-t py-12 bg-gray-50 dark:bg-black">
      <div className="container grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="text-lg font-bold mb-4">RoadReady.</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Experience the ultimate freedom of choice with RoadReady - tailor your
            adventure by choosing from our premium fleet of vehicles.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-muted-foreground hover:text-foreground">
              <Facebook size={20} />
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground">
              <Twitter size={20} />
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground">
              <Instagram size={20} />
            </a>
          </div>
        </div>
        
        <div>
          <h4 className="font-bold mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
                Home
              </Link>
            </li>
            <li>
              <Link to="/cars" className="text-sm text-muted-foreground hover:text-foreground">
                Cars
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground">
                Contact
              </Link>
            </li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold mb-4">Our Services</h4>
          <ul className="space-y-2">
            <li>
              <Link to="cars" className="text-sm text-muted-foreground hover:text-foreground">
                Car Rental
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground">
                Long Term Leasing
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground">
                Airport Transfer
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground">
                Corporate Services
              </Link>
            </li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold mb-4">Newsletter</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Subscribe to our newsletter for exclusive deals and updates.
          </p>
          <form className="flex gap-2">
            <Input type="email" placeholder="Enter your email" className="flex-1" />
            <Button type="submit" variant="destructive" className="bg-red-500 hover:bg-red-600">
              Subscribe
            </Button>
          </form>
        </div>
      </div>
      <div className="container mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} RoadReady. All rights reserved.</p>
    
        Developed by <a href="https://github.com/yvsser1" className="text-muted-foreground hover:text-foreground">Yasser Dalouzi</a>
      </div>
    </footer>
  )
}

