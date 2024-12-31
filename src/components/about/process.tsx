import React from 'react';
import { MousePointer, Car, Calendar, RotateCcw } from 'lucide-react'

const steps = [
  {
    icon: MousePointer,
    title: "Select",
    description: "Choose your desired car from our fleet"
  },
  {
    icon: Car,
    title: "Drive",
    description: "Pick up your car from the nearest location"
  },
  {
    icon: Calendar,
    title: "Book",
    description: "Reserve your car through our site"
  },
  {
    icon: RotateCcw,
    title: "Return",
    description: "Bring the car back at the end of your rental period"
  }
]

export function Process() {
  return (
    <section className="py-24 bg-secondary">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-4 animate-fade-in">How it Works</h2>
        <h3 className="text-2xl text-center mb-16 text-muted-foreground animate-fade-in animate-delay-100">Simple Steps to Get the Car</h3>
        
        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center animate-slide-in" style={{animationDelay: `${index * 100}ms`}}>
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
                index === 2 ? 'bg-primary text-primary-foreground' : 'bg-accent text-accent-foreground'
              } animate-float`}>
                <step.icon className={`w-10 h-10`} />
              </div>
              <h4 className="font-semibold mb-2">{step.title}</h4>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

