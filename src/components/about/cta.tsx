import React from 'react';
import { Button } from "@/components/ui/button"

export function CTA() {
  return (
    <section className="relative overflow-hidden bg-black text-white py-24">
      <div className="container relative z-10">
        <div className="max-w-2xl animate-slide-in">
          <h2 className="text-4xl font-bold mb-6">
            Reserve Your Dream Car Today and Feel Best Experience Travel
          </h2>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground button-hover">
            Let's Drive with Us
          </Button>
        </div>
      </div>
      <img
        src="https://yzozbqmjlkfwdqywxpdt.supabase.co/storage/v1/object/sign/cars/porsche-model5%201.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJjYXJzL3BvcnNjaGUtbW9kZWw1IDEucG5nIiwiaWF0IjoxNzM1NDgxMDAyLCJleHAiOjE3NjcwMTcwMDJ9.AfrR0G7PMcXpkp6-vjIIVwxKHe4dVaPUdedb7RTZZgI&t=2024-12-29T14%3A03%3A21.803Z"
        alt="Car headlights in dark"
        className="absolute right-0 top-0 h-full w-1/2 object-cover opacity-50 animate-fade-in animate-delay-200"
      />
    </section>
  )
}

