import { Eye, EyeOff } from 'lucide-react'
import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { authService } from '@/services/api/authService'
import { useProfile } from '@/hooks/useProfile'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'

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
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = () => {}

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0b1e26] bg-gradient-to-b from-[#0d1f27] to-[#0b1c23] p-4">
      <div className="w-full max-w-md">
        <Card className="rounded-2xl border border-[#1e3a46] bg-[#0f2733]/90 px-2 pt-2 pb-3 shadow-2xl backdrop-blur-md">
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
              <p className="text-sm text-slate-400">Please enter your details to sign in.</p>
            </div>
          </CardHeader>

          {/* Content */}
          <CardContent className="space-y-5 px-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[13px] text-slate-200">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  className="h-11 rounded-lg border border-[#274556] bg-[#102530] text-slate-200 placeholder:text-slate-500"
                  placeholder="yourname@example.com"
                  {...register('email')}
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-[13px] text-slate-200">Password</Label>
                  <Link to="/forgot-password" className="text-[12px] text-cyan-400 hover:underline">
                    Forgot Password?
                  </Link>
                </div>

                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    className="h-11 rounded-lg border border-[#274556] bg-[#102530] pr-10 text-slate-200 placeholder:text-slate-500"
                    placeholder="Enter your password"
                    {...register('password')}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 right-1 h-10 w-10 -translate-y-1/2 text-slate-400 hover:bg-transparent hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* Sign In button */}
              <Button
                type="submit"
                disabled={loading}
                className="h-11 w-full rounded-lg bg-[#39b7f1] font-semibold text-[#0f1c24] shadow-md hover:bg-[#2ea3d8]"
              >
                Sign In
              </Button>

              {/* OR Divider */}
              <div className="flex items-center">
                <div className="flex-1 border-t border-[#274556]"></div>
                <span className="px-3 text-[12px] text-slate-400">OR</span>
                <div className="flex-1 border-t border-[#274556]"></div>
              </div>

              {/* Google Button */}
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleLogin}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#274556] bg-[#102530] text-white"
              >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="h-5 w-5" />
                Continue with Google
              </Button>
            </form>
          </CardContent>

          {/* Footer */}
          <CardFooter className="justify-center pb-3 text-center">
            <p className="text-center text-sm text-slate-400">
              Don’t have an account?{' '}
              <Link to="/register" className="text-cyan-400 hover:underline">
                Create free account
              </Link>
            </p>
          </CardFooter>
        </Card>

        <p className="mt-3 text-center text-[11px] text-slate-500">© 2024 Personal Journal App. All rights reserved.</p>
      </div>
    </div>
  )
}
