import React from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Newsletter() {
  return (
    <section className="py-12 border-t bg-secondary">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between gap-8 items-center">
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold mb-2">Don't Miss a Thing</h2>
            <p className="text-muted-foreground">Subscribe to our newsletter for exclusive deals and updates.</p>
          </div>
          <div className="flex gap-4 max-w-md w-full animate-slide-in animate-delay-100">
            <Input type="email" placeholder="Enter email address to subscribe" className="flex-grow" />
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground button-hover">Subscribe</Button>
          </div>
        </div>
      </div>
    </section>
  )
}

