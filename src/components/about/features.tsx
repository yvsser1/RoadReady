import React from 'react';
import { Car, Shield, Clock, Heart } from 'lucide-react'

const features = [
  {
    icon: Car,
    title: "Quality & Variety",
    description: "Discover our diverse range of meticulously maintained vehicles, ensuring your journey starts in style."
  },
  {
    icon: Shield,
    title: "Affordable Rates",
    description: "We believe that luxury travel should be accessible to all. We offer competitive rates without hidden fees."
  },
  {
    icon: Clock,
    title: "Easy Booking",
    description: "Reserving your dream car is a breeze with RoadReady. Our user-friendly system makes the process simple and efficient."
  },
  {
    icon: Heart,
    title: "Customer Satisfaction",
    description: "Our loyal customers have chosen us for the excellence of our service and dedicated support team."
  }
]

export function Features() {
  return (
    <section className="py-24 bg-background">
      <div className="container">
        <h2 className="text-4xl font-bold text-center mb-16 animate-fade-in">Why Choose RoadReady?</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="p-6 rounded-lg border bg-card text-card-foreground shadow-lg hover-lift card-hover animate-fade-in animate-delay-100" style={{animationDelay: `${index * 100}ms`}}>
              <feature.icon className="w-12 h-12 mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

