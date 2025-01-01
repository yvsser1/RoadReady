import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { cn } from '../lib/utils'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { supabase } from '../lib/supabaseClient'
import { toast } from '../hooks/use-toast'
import { Icons } from '../components/ui/icons'

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    })

    setIsLoading(false)

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Success",
      description: "Password reset email sent. Check your inbox.",
    })
    navigate('/login')
  }

  return (
    <div className="container relative flex min-h-screen items-center justify-center p-4">
      <div className="flex flex-col gap-6 w-full max-w-[800px]">
        <Card className="overflow-hidden">
          <CardContent className="grid p-0 md:grid-cols-2">
            <form className="p-6 md:p-8" onSubmit={handleResetPassword}>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Reset password</h1>
                  <p className="text-balance text-muted-foreground">
                    Enter your email to reset your password
                  </p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                  Send Reset Link
                </Button>
                <div className="text-center text-sm">
                  Remember your password?{" "}
                  <Link to="/login" className="underline underline-offset-4 hover:text-primary">
                    Log in
                  </Link>
                </div>
              </div>
            </form>
            <div className="relative hidden bg-muted md:block">
              <img
                src="https://i.pinimg.com/736x/83/85/86/8385862fc782b1abca1dc3f803afe8f6.jpg"
                alt="Luxury car dashboard"
                className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
              />
            </div>
          </CardContent>
        </Card>
        <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
          By clicking continue, you agree to our <Link to="#">Terms of Service</Link>{" "}
          and <Link to="#">Privacy Policy</Link>.
        </div>
      </div>
    </div>
  )
}

