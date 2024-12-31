import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardFooter, CardHeader } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Calendar } from '../components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover'
import { format } from 'date-fns'
import { CalendarIcon, Search } from 'lucide-react'
import { cn } from '../lib/utils'
import { supabase } from '../lib/supabaseClient'
import { SiteHeader } from '../components/site-header'
import { SiteFooter } from '../components/site-footer'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../components/ui/pagination"

interface Car {
  id: number
  name: string
  description: string
  price_per_day: number
  image_url: string
  category: string
}

interface Category {
  id: number
  name: string
  slug: string
  description: string
}

export default function CarsPage() {
  const [cars, setCars] = useState<Car[]>([])
  const [filteredCars, setFilteredCars] = useState<Car[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCar, setSelectedCar] = useState<Car | null>(null)
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [searchTerm, setSearchTerm] = useState('')
  const [priceFilter, setPriceFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [hoveredCardId, setHoveredCardId] = useState<number | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 6
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchCategories()
    fetchCars()
  }, [page])

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCars()
    }, 300)

    return () => clearTimeout(timer)
  }, [page, searchTerm, priceFilter, categoryFilter])

  async function fetchCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name')
    
    if (error) {
      console.error('Error fetching categories:', error)
    } else {
      setCategories(data || [])
    }
  }

  async function fetchCars() {
    setIsLoading(true)
    try {
      const baseQuery = supabase
        .from('cars')
        .select('*', { count: 'exact' })

      let filters = []
      
      if (categoryFilter && categoryFilter !== 'all') {
        filters.push(['category', 'eq', categoryFilter])
      }

      if (priceFilter && priceFilter !== 'all') {
        if (priceFilter === '150') {
          filters.push(['price_per_day', 'gte', 150])
        } else {
          const [min, max] = priceFilter.split('-').map(Number)
          if (!isNaN(min) && !isNaN(max)) {
            filters.push(['price_per_day', 'gte', min])
            filters.push(['price_per_day', 'lt', max])
          }
        }
      }

      if (searchTerm) {
        filters.push(['name', 'ilike', `%${searchTerm}%`])
      }

      let query = baseQuery
      filters.forEach(([column, operator, value]) => {
        query = query.filter(column, operator, value)
      })

      const from = (page - 1) * itemsPerPage
      const to = from + itemsPerPage - 1

      const { data, error, count } = await query
        .order('price_per_day', { ascending: true })
        .order('name', { ascending: true })
        .range(from, to)

      if (error) throw error

      setCars(data || [])
      if (count) {
        setTotalPages(Math.ceil(count / itemsPerPage))
      }
    } catch (error) {
      console.error('Error fetching cars:', error)
      setCars([])
      setTotalPages(1)
    } finally {
      setIsLoading(false)
    }
  }

  function filterCars() {
    setFilteredCars(cars)
  }

  const handleRent = (car: Car) => {
    setSelectedCar(car)
  }

  const handleBooking = () => {
    if (selectedCar && startDate && endDate) {
      navigate('/checkout', { 
        state: { 
          car: selectedCar, 
          startDate: startDate.toISOString(), 
          endDate: endDate.toISOString() 
        } 
      })
    }
  }

  const handleFiltersChange = useCallback(async (
    newSearchTerm?: string,
    newPriceFilter?: string,
    newCategoryFilter?: string
  ) => {
    setPage(1)
    if (newSearchTerm !== undefined) setSearchTerm(newSearchTerm)
    if (newPriceFilter !== undefined) setPriceFilter(newPriceFilter)
    if (newCategoryFilter !== undefined) setCategoryFilter(newCategoryFilter)
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[400px]">
          <img
            src="https://yzozbqmjlkfwdqywxpdt.supabase.co/storage/v1/object/sign/cars/Screenshot_2024-12-26_145535.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJjYXJzL1NjcmVlbnNob3RfMjAyNC0xMi0yNl8xNDU1MzUucG5nIiwiaWF0IjoxNzM1NDc3MjExLCJleHAiOjE3NjcwMTMyMTF9.2dtN6esJ9V36kBPIXMFHOu7gjOmRtzWJdOED984J_Z0&t=2024-12-29T13%3A00%3A11.215Z"
            alt="Luxury car"
            className="absolute inset-0 w-full h-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40" />
          <div className="relative container h-full flex flex-col items-center justify-center text-center text-white animate-fade-in">
            <p className="text-sm mb-2">HOME/CARS</p>
            <h1 className="text-4xl font-bold">Our Impressive Fleet</h1>
          </div>
        </section>

        <div className="container py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-1/4">
              <Card>
                <CardHeader>
                  <h2 className="font-semibold">CATEGORIES</h2>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleFiltersChange(undefined, undefined, 'all')}
                      className={`flex items-center justify-between w-full px-2 py-1 text-sm hover:bg-red-500 rounded-md ${
                        categoryFilter === 'all' ? 'bg-red-500' : ''
                      }`}
                    >
                      <span>All Categories</span>
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category.slug}
                        onClick={() => handleFiltersChange(undefined, undefined, category.slug)}
                        className={`flex items-center justify-between w-full px-2 py-1 text-sm hover:bg-red-500 rounded-md ${
                          categoryFilter === category.slug ? 'bg-red-500' : ''
                        }`}
                      >
                        <span>{category.name}</span>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:w-3/4">
              <div className="flex items-center gap-4 mb-8">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredCars.length} of {cars.length} results
                </p>
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search cars..."
                    value={searchTerm}
                    onChange={(e) => handleFiltersChange(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select 
                  value={priceFilter} 
                  onValueChange={(value) => handleFiltersChange(undefined, value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Price range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All prices</SelectItem>
                    <SelectItem value="0-50">Under $50</SelectItem>
                    <SelectItem value="50-100">$50 - $100</SelectItem>
                    <SelectItem value="100-150">$100 - $150</SelectItem>
                    <SelectItem value="150">$150+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className={`grid md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children ${
                isLoading ? 'opacity-50' : ''
              }`}>
                {cars.map((car) => (
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
                        <p className="text-sm text-muted-foreground mb-4">{car.description}</p>
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
                            onClick={() => handleRent(car)}
                            variant={hoveredCardId === car.id ? "secondary" : "destructive"}
                            className={
                              hoveredCardId === car.id
                                ? "bg-white text-red-500 hover:bg-gray-100"
                                : "bg-red-500 hover:bg-red-600"
                            }
                          >
                            Rent
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-8 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="transition-all duration-200 hover:scale-105 hover:bg-red-50 disabled:opacity-50"
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          onClick={() => setPage(pageNumber)}
                          isActive={page === pageNumber}
                          className={`transition-all duration-200 hover:scale-105 
                            ${page === pageNumber 
                              ? 'bg-red-500 text-white hover:bg-red-600' 
                              : 'hover:bg-red-50'}`}
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="transition-all duration-200 hover:scale-105 hover:bg-red-50 disabled:opacity-50"
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Booking Modal */}
      {selectedCar && (
        <Card className="fixed inset-x-0 bottom-0 p-4 bg-white dark:bg-black border-t shadow-lg animate-slide-up">
          <div className="container flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1 dark:bg-black">
              <h3 className="font-bold">Book {selectedCar.name}</h3>
              <p className="text-sm text-muted-foreground">${selectedCar.price_per_day}/day</p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : <span>Start date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : <span>End date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Button
                onClick={handleBooking}
                disabled={!startDate || !endDate}
                variant="destructive"
                className="bg-red-500 hover:bg-red-600"
              >
                Proceed to Checkout
              </Button>
            </div>
          </div>
        </Card>
      )}

      {isLoading && (
        <div className="flex justify-center my-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
        </div>
      )}

      <SiteFooter />
    </div>
  )
}

