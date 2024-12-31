import React, { useState } from 'react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card'
import { Label } from '../components/ui/label'
import { toast } from '../hooks/use-toast'
import { MapPin, Phone, Mail } from 'lucide-react'
import OpenStreetMap from '../components/OpenStreetMap'
import { SiteFooter } from '../components/site-footer'

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the form data to your backend
    // For now, we'll just show a success message
    toast({
      title: "Message Sent",
      description: "We've received your message and will get back to you soon.",
    })
    // Reset form fields
    setName('')
    setEmail('')
    setSubject('')
    setMessage('')
  }

  const address = "123 Car Street, Auto City, AC 12345"
  const mapPosition: [number, number] = [40.7128, -74.0060] // Example coordinates (New York City)

  return (
    <div className="min-h-screen bg-background text-foreground">
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Contact Us</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Send Us a Message</CardTitle>
            <CardDescription>We'd love to hear from you. Fill out the form below and we'll get back to you as soon as possible.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="subject">Subject</Label>
                  <Input 
                    id="subject" 
                    value={subject} 
                    onChange={(e) => setSubject(e.target.value)} 
                    required
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="message">Message</Label>
                  <Textarea 
                    id="message" 
                    value={message} 
                    onChange={(e) => setMessage(e.target.value)} 
                    required
                  />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSubmit}>Send Message</Button>
          </CardFooter>
        </Card>
        <div>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4" />
                  <p>{address}</p>
                </div>
                <div className="flex items-center">
                  <Phone className="mr-2 h-4 w-4" />
                  <p>+1 (555) 123-4567</p>
                </div>
                <div className="flex items-center">
                  <Mail className="mr-2 h-4 w-4" />
                  <p>contact@roadready.com</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Our Location</CardTitle>
            </CardHeader>
            <CardContent>
              <OpenStreetMap position={mapPosition} popupText={address} />
            </CardContent>
          </Card>
        </div>
      </div>  
    </div>
    <SiteFooter />
    </div>
  )
}

