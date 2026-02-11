import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { authService } from '@/services/api/authService'
import { useProfile } from '@/hooks/useProfile'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import GoogleButton from '@/components/common/GoogleButton'
import ShowPassword from '@/components/common/ShowPassword'
import { getAxiosErrorMessage } from '@/lib/error'

interface LoginForm {
  email: string
  password: string
}

export function LoginPage() {
  const navigate = useNavigate()
  const { setUser } = useProfile()

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>()

  const onSubmit = async (data: LoginForm) => {
    setLoading(true)
    try {
      const response = await authService.login(data.email, data.password)
      setUser(response.user)
      toast.success('Login successful!')
      navigate('/dashboard')
    } catch (error) {
      toast.error(getAxiosErrorMessage(error, 'Login failed'))
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    const googleAuthUrl = authService.getGoogleAuthUrl()
    window.location.href = googleAuthUrl
  }

  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-border bg-card/90 rounded-2xl border px-2 pt-2 pb-3 shadow-2xl backdrop-blur-md">
          {/* Header */}
          <CardHeader className="space-y-4 pt-6 pb-5 text-center">
            <div className="flex justify-center">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/95 shadow-lg">
                <svg width="22" height="22" viewBox="0 0 32 32" fill="none" className="text-[#0f1c24]">
                  <path d="M8 4H20L24 8V28H8V4Z" fill="currentColor" />
                </svg>
              </div>
            </div>

            <div className="space-y-1">
              <h1 className="text-[22px] font-bold text-white">Welcome Back</h1>
              <p className="text-muted-foreground text-sm">Please enter your details to sign in.</p>
            </div>
          </CardHeader>

          {/* Content */}
          <CardContent className="space-y-5 px-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground text-[13px]">
                  Email Address
                </Label>

                <Input
                  id="email"
                  type="email"
                  className="border-border bg-muted text-foreground placeholder:text-muted-foreground h-11 rounded-lg border"
                  placeholder="yourname@example.com"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^\S+@\S+\.\S+$/,
                      message: 'Invalid email address',
                    },
                  })}
                />

                {errors.email && <p className="text-destructive mt-1 text-sm">{errors.email.message}</p>}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-foreground text-[13px]">Password</Label>
                  <Link to="/forgot-password" className="text-primary text-[12px] hover:underline">
                    Forgot Password?
                  </Link>
                </div>

                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    className="border-border bg-muted text-foreground placeholder:text-muted-foreground h-11 rounded-lg border pr-10"
                    placeholder="Enter your password"
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters',
                      },
                    })}
                  />

                  <ShowPassword
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                    className="absolute top-1/2 right-1 h-10 w-10 -translate-y-1/2"
                  />
                </div>

                {errors.password && <p className="text-destructive mt-1 text-sm">{errors.password.message}</p>}
              </div>

              {/* Sign In */}
              <Button className="w-full" type="submit" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>

              {/* Divider */}
              <div className="flex items-center">
                <div className="border-border flex-1 border-t"></div>
                <span className="text-muted-foreground px-3 text-[12px]">OR</span>
                <div className="border-border flex-1 border-t"></div>
              </div>

              {/* Google Button */}
              <GoogleButton handleGoogleLogin={handleGoogleLogin} />
            </form>
          </CardContent>

          {/* Footer */}
          <CardFooter className="justify-center pb-3 text-center">
            <p className="text-muted-foreground text-center text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary hover:underline">
                Create free account
              </Link>
            </p>
          </CardFooter>
        </Card>

        <p className="text-muted-foreground mt-3 text-center text-[11px]">
          © 2024 Personal Journal App. All rights reserved.
        </p>
      </div>
    </div>
  )
}
