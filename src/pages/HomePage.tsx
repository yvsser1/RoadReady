import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardContent, CardFooter, CardHeader } from '../components/ui/card'
import { supabase } from '../lib/supabaseClient'
import { ArrowRight, Facebook, Twitter, Instagram, Youtube } from 'lucide-react'
import { SiteHeader } from '../components/site-header'
import { SiteFooter } from '../components/site-footer'

interface Car {
  id: number
  name: string
  description: string
  price_per_day: number
  image_url: string
}

export default function HomePage() {
  const [featuredCars, setFeaturedCars] = useState<Car[]>([])
  const [hoveredCardId, setHoveredCardId] = useState<number | null>(null)

  useEffect(() => {
    fetchFeaturedCars()
  }, [])

  async function fetchFeaturedCars() {
    // Choose one of these options:

    // Option 1: Get random cars
    /* 
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .order('RANDOM()')
      .limit(3)
      */
    
    // Option 2: Get featured cars based on a column
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .eq('is_featured', true)
      .limit(3)
  

    /* 
    // Option 3: Get most expensive cars
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .order('price_per_day', { ascending: false })
      .limit(3)
    */
    
    if (error) {
      console.error('Error fetching featured cars:', error)
    } else {
      setFeaturedCars(data || [])
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      
      
      <main className="flex-1 dark:bg-black">
        {/* Hero Section */}
        {/* <section className="relative min-h-[80vh] bg-rose-50"> */}
        <section className="relative bg-rose-50 dark:bg-black">
          <div className="container grid lg:grid-cols-2 gap-8 py-12">
            <div className="flex flex-col justify-center space-y-8 animate-fade-in">
              <div className="space-y-6">
                <h1 className="text-5xl font-bold leading-tight tracking-tighter lg:text-6xl">
                  Your Journey,<br />
                  Your Car,<br />
                  Your Way
                </h1>
                <p className="text-lg text-muted-foreground max-w-[500px]">
                  Experience the ultimate freedom of choice with RoadReady - tailor your
                  adventure by choosing from our premium fleet of vehicles.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Button 
                  variant="destructive" 
                  size="lg" 
                  className="bg-red-500 hover:bg-red-600"
                  asChild
                >
                  <Link to="/cars">Get Started</Link>
                </Button>
                <Button variant="outline" size="lg">
                  Learn more
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center gap-4">
                {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                  <button
                    key={i}
                    className="p-2 rounded-full hover:bg-gray-100"
                    aria-label={`Social media link ${i + 1}`}
                  >
                    <Icon className="h-5 w-5" />
                  </button>
                ))}
              </div>
            </div>

            <div className="relative animate-fade-in">
              <img
                src="https://yzozbqmjlkfwdqywxpdt.supabase.co/storage/v1/object/sign/cars/PORSH.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJjYXJzL1BPUlNILnBuZyIsImlhdCI6MTczNTU2NTk3MSwiZXhwIjoxNzY3MTAxOTcxfQ.3zDDLPMaXgiB24_BdtmDDbfy7oFglf5N7tZFx_pBFog&t=2024-12-30T13%3A39%3A31.107Z"
                alt="Red luxury car"
                className="w-full h-auto"
              />
              <div className="absolute top-4 right-4 bg-white dark:bg-blue-500 rounded-lg p-4 shadow-lg">
                <div className="text-sm font-medium">50+</div>
                <div className="text-xs text-muted-foreground">Car Types Available</div>
              </div>
              <div className="absolute bottom-4 right-4 bg-white dark:bg-blue-500 rounded-lg p-4 shadow-lg">
                <div className="text-sm font-medium">12.5K+ PEOPLE</div>
                <div className="text-xs text-muted-foreground">
                  have used our services such as renting, buying or even selling their car
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Partner Logos */}
        <section className="py-12 border-y">
          <div className="container">
            <div className="grid grid-cols-3 md:grid-cols-6 gap-8 items-centerjustify-center ">
              {[
                'https://upload.wikimedia.org/wikipedia/commons/f/f4/BMW_logo_%28gray%29.svg',
                'https://upload.wikimedia.org/wikipedia/commons/9/90/Mercedes-Logo.svg',
                'https://yzozbqmjlkfwdqywxpdt.supabase.co/storage/v1/object/sign/cars/Vector.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJjYXJzL1ZlY3Rvci5wbmciLCJpYXQiOjE3MzU0Nzg1OTksImV4cCI6MTc2NzAxNDU5OX0.tfV9Rbfgg3NYWbM-pC-vX0HUjNK5amTsPn4XSXtmMIY&t=2024-12-29T13%3A23%3A19.507Z',
                'https://upload.wikimedia.org/wikipedia/en/8/8c/Porsche_logo.svg',
                'https://upload.wikimedia.org/wikipedia/commons/9/9d/Toyota_carlogo.svg',
                'https://upload.wikimedia.org/wikipedia/commons/3/38/Honda.svg'
              ].map((src, i) => (
                <div key={i} className="flex items-center justify-center">
                  <img
                    src={src}
                    alt={`Partner logo ${i + 1}`}
                    className="h-[51px] w-[144px] opacity-50 hover:opacity-100 transition-opacity"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Cars */}
        <section className="py-16">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold mb-2">THE CARS</h2>
              <h3 className="text-3xl font-bold">Our Impressive Fleet</h3>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
              {featuredCars.map((car) => (
                <Card 
                  key={car.id}
                  className={`overflow-hidden card-hover ${
                    hoveredCardId === car.id ? 'bg-red-500 text-white' : ''
                  }`}
                  onMouseEnter={() => setHoveredCardId(car.id)}
                  onMouseLeave={() => setHoveredCardId(null)}
                >
                  <CardContent className="p-0">
                    <div className="aspect-[4/3] relative overflow-hidden">
                      <img
                        src={car.image_url}
                        alt={car.name}
                        className="absolute inset-0 h-full w-full object-contain image-hover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2">{car.name}</h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className={`text-sm ${
                            hoveredCardId === car.id ? 'text-white/80' : 'text-muted-foreground'
                          }`}>
                            Starting at
                          </div>
                          <div className="font-bold">${car.price_per_day}/day</div>
                        </div>
                        <Button 
                          variant={hoveredCardId === car.id ? "secondary" : "destructive"}
                          className={
                            hoveredCardId === car.id
                              ? "bg-white text-red-500 hover:bg-gray-100"
                              : "bg-red-500 hover:bg-red-600"
                          }
                          asChild
                        >
                          <Link to="/cars">Rent</Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Section */}
        <section className="py-16 bg-gray-50 dark:bg-black ">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-6">Why Choose RoadReady?</h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Join our satisfied customers who trust us for their journeys.
                  We serve with a lot of values that you can feel directly.
                </p>
                <div className="grid gap-4 ">
                  {[
                    {
                      title: "Quality & Variety",
                      description: "Explore our diverse range of premium vehicles"
                    },
                    {
                      title: "Easy Booking",
                      description: "Reserve your car in just a few clicks"
                    },
                    {
                      title: "Affordable Rates",
                      description: "Enjoy competitive prices without hidden fees"
                    }
                  ].map((benefit, index) => (
                    <Card key={index}>
                      <CardContent className="flex items-start gap-4 p-4 ">
                        <div>
                          <h3 className="font-semibold mb-1">{benefit.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {benefit.description}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              
              <div className="relative">
                <img
                  src="https://yzozbqmjlkfwdqywxpdt.supabase.co/storage/v1/object/sign/cars/Car%20Model.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJjYXJzL0NhciBNb2RlbC5wbmciLCJpYXQiOjE3MzU1NjYxNzQsImV4cCI6MTc2NzEwMjE3NH0.4ixR55hgKqssoyVNn7gou8p9f3cT0srM43c9v1cm3NQ&t=2024-12-30T13%3A42%3A53.943Z"
                  alt="Red luxury car"
                  className="w-full rounded-lg shadow-xl"
                />
                <div className="absolute -top-4 -right-4 bg-white p-4 rounded-lg shadow-lg dark:bg-blue-500 ">
                  <h4 className="font-semibold">Quality & Variety</h4>
                  <p className="text-sm text-muted-foreground">
                    Explore our diverse range of premium vehicles
                  </p>
                </div>
                <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-lg shadow-lg dark:bg-blue-500 ">
                  <h4 className="font-semibold">Affordable Rates</h4>
                  <p className="text-sm text-muted-foreground">
                    Enjoy competitive prices without hidden fees
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16">
          <div className="container">
            <div className="text-center max-w-md mx-auto">
              <h2 className="text-2xl font-bold mb-4">Don't Miss a Thing</h2>
              <p className="text-muted-foreground mb-6">
                Subscribe to our newsletter for exclusive deals and updates
              </p>
              <div className="flex gap-2">
                <Input 
                  type="email" 
                  placeholder="Enter email address to subscribe" 
                  className="flex-1"
                />
                <Button variant="destructive" className="bg-red-500 hover:bg-red-600">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}

