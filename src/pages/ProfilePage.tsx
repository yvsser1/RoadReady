import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card'
import { useToast } from '../hooks/use-toast'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar'

interface UserProfile {
  id: string
  full_name: string
  avatar_url: string
  email: string
}

interface Booking {
  id: number
  car_id: number
  start_date: string
  end_date: string
  total_price: number
  status: string
  car: {
    name: string
  }
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [avatar, setAvatar] = useState<File | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const { toast } = useToast()

  useEffect(() => {
    fetchProfile()
    fetchBookings()
  }, [])

  async function fetchProfile() {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        toast({
          title: "Error",
          description: "Failed to fetch profile. Please try again.",
          variant: "destructive",
        })
      } else if (data) {
        setProfile(data)
        setFullName(data.full_name || '')
        setEmail(user.email || '')
      }
    }
  }

  async function fetchBookings() {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data, error } = await supabase
        .from('rentals')
        .select('*, car:cars(name)')
        .eq('user_id', user.id)
        .order('start_date', { ascending: false })

      if (error) {
        console.error('Error fetching bookings:', error)
        toast({
          title: "Error",
          description: "Failed to fetch bookings. Please try again.",
          variant: "destructive",
        })
      } else {
        setBookings(data || [])
      }
    }
  }

  async function updateProfile() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // First update the profile
    const { error: profileError } = await supabase
      .from('users')
      .update({
        full_name: fullName,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)

    if (profileError) {
      console.error('Error updating profile:', profileError)
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
      return
    }

    // Then handle avatar upload if there is one
    if (avatar) {
      // Delete old avatar first if exists
      if (profile?.avatar_url) {
        const oldAvatarPath = profile.avatar_url.split('/').pop()
        if (oldAvatarPath) {
          await supabase.storage
            .from('avatars')
            .remove([oldAvatarPath])
        }
      }

      const fileExt = avatar.name.split('.').pop()
      const fileName = `${user.id}-${Math.random()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, avatar)

      if (uploadError) {
        console.error('Error uploading avatar:', uploadError)
        toast({
          title: "Error",
          description: "Failed to upload avatar. Please try again.",
          variant: "destructive",
        })
        return
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)

      const { error: avatarUpdateError } = await supabase
        .from('users')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id)

      if (avatarUpdateError) {
        console.error('Error updating avatar URL:', avatarUpdateError)
        toast({
          title: "Error",
          description: "Failed to update avatar. Please try again.",
          variant: "destructive",
        })
        return
      }
    }

    toast({
      title: "Success",
      description: "Profile updated successfully.",
    })
    
    fetchProfile()
  }

  async function changePassword() {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive",
      })
      return
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })

    if (error) {
      console.error('Error changing password:', error)
      toast({
        title: "Error",
        description: "Failed to change password. Please try again.",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "Password changed successfully.",
      })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>User Profile</CardTitle>
            </CardHeader>
            <CardContent>
              {profile && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={profile.avatar_url || '/placeholder-avatar.png'} alt="Avatar" />
                      <AvatarFallback>{profile.full_name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <Label htmlFor="avatar">Change Avatar</Label>
                      <Input
                        id="avatar"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setAvatar(e.target.files?.[0] || null)}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={email}
                      disabled
                    />
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={updateProfile}>Update Profile</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle>Your Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              {bookings.length > 0 ? (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <Card key={booking.id}>
                      <CardContent className="p-4">
                        <h3 className="font-bold">{booking.car.name}</h3>
                        <p>Start Date: {new Date(booking.start_date).toLocaleDateString()}</p>
                        <p>End Date: {new Date(booking.end_date).toLocaleDateString()}</p>
                        <p>Total Price: ${booking.total_price}</p>
                        <p>Status: {booking.status}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p>You have no bookings yet.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={changePassword}>Change Password</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

