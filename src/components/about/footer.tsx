import React from 'react';
import { Link } from 'react-router-dom'

const quickLinks = {
  "Quick Link": ["About us", "How we are", "Contact Us"],
  "The Cars": ["Fleet listing", "Book a car", "FAQs"],
  "Social Media": ["Facebook", "Instagram", "Twitter"]
}

export function Footer() {
  return (
    <footer className="bg-background py-12 border-t">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {Object.entries(quickLinks).map(([category, links], index) => (
            <div key={category} className="animate-fade-in" style={{animationDelay: `${index * 100}ms`}}>
              <h3 className="font-semibold mb-4 text-primary">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <Link to="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 pt-8 border-t text-sm text-muted-foreground animate-fade-in animate-delay-300">
          <p>Copyright © {new Date().getFullYear()} RoadReady. All rights reserved.</p>
          <p>Developed by ©Yasser Dalouzi</p>
        </div>
      </div>
    </footer>
  )
}

