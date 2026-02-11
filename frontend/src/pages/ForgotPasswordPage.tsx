import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { authService } from '@/services/api/authService'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { getAxiosErrorMessage } from '@/lib/error'

interface ForgotPasswordForm {
  email: string
}

export function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>()

  const onSubmit = async (data: ForgotPasswordForm) => {
    setLoading(true)
    try {
      await authService.forgotPassword(data.email)
      setEmailSent(true)
      toast.success('Password reset email sent! Please check your inbox.')
    } catch (error) {
      toast.error(getAxiosErrorMessage(error, 'Failed to send reset email'))
    } finally {
      setLoading(false)
    }
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
              <h1 className="text-[22px] font-bold text-white">Forgot Password?</h1>
              <p className="text-muted-foreground text-sm">
                {emailSent
                  ? 'Check your email for reset instructions'
                  : 'Enter your email to receive a password reset link'}
              </p>
            </div>
          </CardHeader>

          {/* Content */}
          <CardContent className="space-y-5 px-8">
            {emailSent ? (
              <div className="space-y-4">
                <div className="bg-primary/10 border-primary/20 rounded-lg border p-4 text-center">
                  <p className="text-foreground text-sm">
                    We've sent a password reset link to your email address. Please check your inbox and follow the
                    instructions.
                  </p>
                  <p className="text-muted-foreground mt-2 text-xs">The link will expire in 15 minutes.</p>
                </div>

                <Button className="w-full" asChild>
                  <Link to="/login">Back to Login</Link>
                </Button>
              </div>
            ) : (
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

                {/* Submit Button */}
                <Button className="w-full" type="submit" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </Button>

                {/* Back to Login */}
                <div className="text-center">
                  <Link to="/login" className="text-primary text-sm hover:underline">
                    Back to Login
                  </Link>
                </div>
              </form>
            )}
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
