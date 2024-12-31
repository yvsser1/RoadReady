import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { Button } from '../ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination"

interface Rental {
  id: number
  user_id: string
  car_id: number
  start_date: string
  end_date: string
  total_price: number
  status: string
  car: {
    name: string
  }
  user: {
    email: string
  }
  client_name: string
  client_phone: string
  client_address: string
}

export default function RentalManagement() {
  const [rentals, setRentals] = useState<Rental[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    fetchRentals()
  }, [page])

  async function fetchRentals() {
    const from = (page - 1) * itemsPerPage
    const to = from + itemsPerPage - 1

    const { data: totalData } = await supabase
      .from('rentals')
      .select('id', { count: 'exact' })

    const { data, error } = await supabase
      .from('rentals')
      .select(`
        *,
        car:cars(name),
        user:users(email)
      `)
      .range(from, to)
      .order('start_date', { ascending: false })
    
    if (error) {
      console.error('Error fetching rentals:', error)
    } else {
      setRentals(data || [])
      setTotalPages(Math.ceil((totalData?.length || 0) / itemsPerPage))
    }
  }

  async function updateRentalStatus(id: number, status: string) {
    const { error } = await supabase
      .from('rentals')
      .update({ status })
      .eq('id', id)
    
    if (error) {
      console.error('Error updating rental status:', error)
    } else {
      setRentals(rentals.map(rental => 
        rental.id === id ? { ...rental, status } : rental
      ))
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4"></h2>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Car</TableHead>
              <TableHead>Client Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Total Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rentals.map((rental) => (
              <TableRow key={rental.id}>
                <TableCell>{rental.id}</TableCell>
                <TableCell>{rental.user.email}</TableCell>
                <TableCell>{rental.car.name}</TableCell>
                <TableCell>{rental.client_name}</TableCell>
                <TableCell>{rental.client_phone}</TableCell>
                <TableCell>{rental.client_address}</TableCell>
                <TableCell>{new Date(rental.start_date).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(rental.end_date).toLocaleDateString()}</TableCell>
                <TableCell>${rental.total_price.toFixed(2)}</TableCell>
                <TableCell>{rental.status}</TableCell>
                <TableCell>
                  <Select
                    value={rental.status}
                    onValueChange={(value) => updateRentalStatus(rental.id, value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="mt-4 flex justify-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
              <PaginationItem key={pageNumber}>
                <PaginationLink
                  onClick={() => setPage(pageNumber)}
                  isActive={page === pageNumber}
                >
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}

