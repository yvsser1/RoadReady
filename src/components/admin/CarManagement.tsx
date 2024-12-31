import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card'

interface Car {
  id: number
  name: string
  description: string
  price_per_day: number
  image_url: string
}

export default function CarManagement() {
  const [cars, setCars] = useState<Car[]>([])
  const [newCar, setNewCar] = useState<Partial<Car>>({})
  const [editingCar, setEditingCar] = useState<Car | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const carsPerPage = 6

  useEffect(() => {
    fetchCars()
  }, [currentPage])

  async function fetchCars() {
    // First, get the total count
    const { count } = await supabase
      .from('cars')
      .select('*', { count: 'exact', head: true })

    if (count !== null) {
      setTotalPages(Math.ceil(count / carsPerPage))
    }

    // Then fetch the paginated data
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .range((currentPage - 1) * carsPerPage, currentPage * carsPerPage - 1)
      .order('id')
    
    if (error) {
      console.error('Error fetching cars:', error)
    } else {
      setCars(data || [])
    }
  }

  async function createCar() {
    const { data, error } = await supabase
      .from('cars')
      .insert([newCar])
      .select()
    
    if (error) {
      console.error('Error creating car:', error)
    } else {
      await fetchCars() // Refresh the list
      setNewCar({})
    }
  }

  async function updateCar() {
    if (!editingCar) return

    const { data, error } = await supabase
      .from('cars')
      .update(editingCar)
      .eq('id', editingCar.id)
      .select()
    
    if (error) {
      console.error('Error updating car:', error)
    } else {
      await fetchCars() // Refresh the list
      setEditingCar(null)
    }
  }

  async function deleteCar(id: number) {
    const { error } = await supabase
      .from('cars')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting car:', error)
    } else {
      await fetchCars() // Refresh the list
    }
  }

  async function toggleFeatured(carId: number, isFeatured: boolean) {
    const { error } = await supabase
      .from('cars')
      .update({ is_featured: isFeatured })
      .eq('id', carId)
    
    if (error) {
      console.error('Error updating featured status:', error)
    } else {
      // Refresh the car list
      fetchCars()
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4"></h2>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{editingCar ? 'Edit Car' : 'Add New Car'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={editingCar ? editingCar.name : newCar.name || ''}
                onChange={(e) => editingCar ? setEditingCar({...editingCar, name: e.target.value}) : setNewCar({...newCar, name: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={editingCar ? editingCar.description : newCar.description || ''}
                onChange={(e) => editingCar ? setEditingCar({...editingCar, description: e.target.value}) : setNewCar({...newCar, description: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="price">Price per Day</Label>
              <Input
                id="price"
                type="number"
                value={editingCar ? editingCar.price_per_day : newCar.price_per_day || ''}
                onChange={(e) => editingCar ? setEditingCar({...editingCar, price_per_day: parseFloat(e.target.value)}) : setNewCar({...newCar, price_per_day: parseFloat(e.target.value)})}
              />
            </div>
            <div>
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                value={editingCar ? editingCar.image_url : newCar.image_url || ''}
                onChange={(e) => editingCar ? setEditingCar({...editingCar, image_url: e.target.value}) : setNewCar({...newCar, image_url: e.target.value})}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={editingCar ? updateCar : createCar}>
            {editingCar ? 'Update Car' : 'Add Car'}
          </Button>
          {editingCar && (
            <Button variant="outline" onClick={() => setEditingCar(null)} className="ml-2">
              Cancel
            </Button>
          )}
        </CardFooter>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {cars.map((car) => (
          <Card key={car.id}>
            <CardHeader>
              <CardTitle>{car.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <img src={car.image_url} alt={car.name} className="w-full h-48 object-contain mb-4" />
              <p>{car.description}</p>
              <p className="font-bold mt-2">${car.price_per_day}/day</p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => setEditingCar(car)} className="mr-2">Edit</Button>
              <Button variant="destructive" onClick={() => deleteCar(car.id)}>Delete</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-2 mt-6">
        <Button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span className="mx-4">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  )
}

