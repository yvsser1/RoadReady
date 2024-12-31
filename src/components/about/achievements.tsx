import React from 'react';
import { Award, Star, Trophy, Truck, Headphones, TrendingUp, Users, BarChart } from 'lucide-react'

const achievements = [
  { icon: Award, label: "Customer Choice Award" },
  { icon: Star, label: "Service Excellence" },
  { icon: Trophy, label: "Regional Champion" },
  { icon: Truck, label: "Reliable Travel Partner" },
  { icon: Headphones, label: "24/7 Customer Support" },
  { icon: TrendingUp, label: "Business Growth Milestone" },
  { icon: Users, label: "Community Engagement" },
  { icon: BarChart, label: "Industry Leadership" }
]

export function Achievements() {
  return (
    <section className="py-24 bg-background">
      <div className="container">
        <h2 className="text-4xl font-bold mb-4 animate-fade-in">Let's See Our</h2>
        <h3 className="text-3xl font-bold mb-16 text-primary animate-fade-in animate-delay-100">Celebrate Milestones</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {achievements.map((item, index) => (
            <div key={index} className="flex flex-col items-center text-center animate-scale-in hover-lift" style={{animationDelay: `${index * 50}ms`}}>
              <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center mb-4">
                <item.icon className="w-10 h-10 text-primary" />
              </div>
              <p className="text-sm font-medium">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

