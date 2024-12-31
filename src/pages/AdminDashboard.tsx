'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { supabase } from '../lib/supabaseClient'
import { BarChart, Users, ShoppingCart, Activity } from 'lucide-react'
import CarManagement from '../components/admin/CarManagement'
import RentalManagement from '../components/admin/RentalManagement'
import UserManagement from '../components/admin/UserManagement'
import Sidebar from '../components/admin/Sidebar'

interface DashboardStats {
  totalRevenue: number
  totalCustomers: number
  totalRentals: number
  activeRentals: number
  recentSales: Array<{
    id: string
    user: {
      name: string
      email: string
      avatar?: string
    }
    amount: number
    date: string
  }>
  monthlyRevenue: Array<{
    month: string
    amount: number
  }>
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalCustomers: 0,
    totalRentals: 0,
    activeRentals: 0,
    recentSales: [],
    monthlyRevenue: []
  })
  const [currentTab, setCurrentTab] = useState('overview')

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  async function fetchDashboardStats() {
    const { data: customers, error: customersError } = await supabase
      .from('users')
      .select('id')

    const { data: rentals, error: rentalsError } = await supabase
      .from('rentals')
      .select(`
        id,
        total_price,
        status,
        created_at,
        user:users (
          full_name,
          email,
          avatar_url
        )
      `)
      .order('created_at', { ascending: false })

    if (!customersError && !rentalsError && rentals) {
      const totalRevenue = rentals.reduce((sum, rental) => sum + rental.total_price, 0)
      const activeRentals = rentals.filter(rental => rental.status === 'active').length
      
      // Process monthly revenue
      const monthlyRevenue = processMonthlyRevenue(rentals)
      
      // Process recent sales
      const recentSales = rentals.slice(0, 5).map(rental => ({
        id: rental.id,
        user: {
          name: rental.user.full_name,
          email: rental.user.email,
          avatar: rental.user.avatar_url
        },
        amount: rental.total_price,
        date: new Date(rental.created_at).toLocaleDateString()
      }))

      setStats({
        totalRevenue,
        totalCustomers: customers?.length || 0,
        totalRentals: rentals.length,
        activeRentals,
        recentSales,
        monthlyRevenue
      })
    }
  }

  function processMonthlyRevenue(rentals: any[]) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const monthlyData = new Array(12).fill(0)

    rentals.forEach(rental => {
      const month = new Date(rental.created_at).getMonth()
      monthlyData[month] += rental.total_price
    })

    return months.map((month, index) => ({
      month,
      amount: monthlyData[index]
    }))
  }

  const renderContent = () => {
    switch (currentTab) {
      case 'overview':
        return (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <BarChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    +20.1% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Customers</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+{stats.totalCustomers}</div>
                  <p className="text-xs text-muted-foreground">
                    +180.1% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Sales</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+{stats.totalRentals}</div>
                  <p className="text-xs text-muted-foreground">
                    +19% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Now</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+{stats.activeRentals}</div>
                  <p className="text-xs text-muted-foreground">
                    +201 since last hour
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full relative">
                    <div className="absolute inset-0 flex items-end justify-between px-4">
                      {stats.monthlyRevenue.map((data, index) => (
                        <div
                          key={data.month}
                          className="relative flex flex-col items-center justify-end"
                          style={{ height: '100%', width: `${100 / 12}%` }}
                        >
                          <div
                            className="w-full bg-primary rounded-t"
                            style={{
                              height: `${(data.amount / Math.max(...stats.monthlyRevenue.map(d => d.amount))) * 100}%`,
                              minHeight: '4px'
                            }}
                          />
                          <span className="absolute bottom-[-24px] text-xs">
                            {data.month}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Recent Sales</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {stats.recentSales.map(sale => (
                      <div key={sale.id} className="flex items-center">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={sale.user.avatar} alt={sale.user.name} />
                          <AvatarFallback>
                            {sale.user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="ml-4 space-y-1">
                          <p className="text-sm font-medium leading-none">{sale.user.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {sale.user.email}
                          </p>
                        </div>
                        <div className="ml-auto font-medium">
                          +${sale.amount}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )
      case 'cars':
        return <CarManagement />
      case 'rentals':
        return <RentalManagement />
      case 'users':
        return <UserManagement />
      case 'notifications':
        return (
          <div className="p-4">
            <h2 className="text-2xl font-bold">Notifications</h2>
            <p>Notifications feature coming soon...</p>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        currentTab={currentTab}
        onTabChange={setCurrentTab}
      />
      <div className="flex-1 overflow-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h1 className="text-2xl font-bold">
            {menuItems.find(item => item.id === currentTab)?.label}
          </h1>
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Search..."
              className="w-[150px] lg:w-[250px]"
            />
          </div>
        </div>
        <div className="p-4">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}

const menuItems = [
  { id: 'overview', label: 'Overview' },
  { id: 'cars', label: 'Car Management' },
  { id: 'rentals', label: 'Rental Management' },
  { id: 'users', label: 'User Management' },
  { id: 'notifications', label: 'Notifications' },
]

