import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { supabase } from '../lib/supabaseClient'
import { useToast } from '../hooks/use-toast'

interface CheckoutState {
  car: {
    id: number
    name: string
    price_per_day: number
  }
  startDate: string
  endDate: string
}

export default function CheckoutPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { car, startDate, endDate } = location.state as CheckoutState

  const [totalPrice, setTotalPrice] = useState(0)
  const [fullName, setFullName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [address, setAddress] = useState('')

  const { toast } = useToast()

  useEffect(() => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    setTotalPrice(car.price_per_day * days)
  }, [car, startDate, endDate])

  const handleCheckout = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      alert('Please log in to complete the booking')
      return
    }

    const { data, error } = await supabase
      .from('rentals')
      .insert([
        {
          user_id: user.id,
          car_id: car.id,
          start_date: startDate,
          end_date: endDate,
          total_price: totalPrice,
          status: 'confirmed',
          client_name: fullName,
          client_phone: phoneNumber,
          client_address: address
        }
      ])

    if (error) {
      console.error('Error creating rental:', error)
      toast({
        title: "Error",
        description: "Failed to create rental. Please try again.",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "Booking confirmed!",
      })
      navigate('/')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h2 className="font-bold">Booking Summary</h2>
              <p>Car: {car.name}</p>
              <p>Start Date: {new Date(startDate).toLocaleDateString()}</p>
              <p>End Date: {new Date(endDate).toLocaleDateString()}</p>
              <p>Total Price: ${totalPrice.toFixed(2)}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1 (123) 456-7890"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="123 Main St, City, State, ZIP"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleCheckout} className="w-full">
            Confirm Booking
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

