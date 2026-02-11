import { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { authService } from '@/services/api/authService'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import ShowPassword from '@/components/common/ShowPassword'
import { getAxiosErrorMessage } from '@/lib/error'

interface ResetPasswordForm {
  newPassword: string
  confirmPassword: string
}

export function ResetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordForm>()

  const newPassword = watch('newPassword')

  const onSubmit = async (data: ResetPasswordForm) => {
    if (!token) {
      toast.error('Invalid reset link')
      return
    }

    setLoading(true)
    try {
      await authService.resetPassword(token, data.newPassword)
      toast.success('Password reset successful! You can now login.')
      navigate('/login')
    } catch (error) {
      toast.error(getAxiosErrorMessage(error, 'Failed to reset password'))
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="border-border bg-card/90 rounded-2xl border px-2 pt-2 pb-3 shadow-2xl backdrop-blur-md">
            <CardContent className="space-y-5 px-8 py-8">
              <div className="bg-destructive/10 border-destructive/20 rounded-lg border p-4 text-center">
                <p className="text-foreground text-sm">Invalid or missing reset token.</p>
              </div>
              <Button className="w-full" asChild>
                <Link to="/forgot-password">Request New Reset Link</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
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
              <h1 className="text-[22px] font-bold text-white">Reset Password</h1>
              <p className="text-muted-foreground text-sm">Enter your new password below</p>
            </div>
          </CardHeader>

          {/* Content */}
          <CardContent className="space-y-5 px-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* New Password */}
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-foreground text-[13px]">
                  New Password
                </Label>

                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPassword ? 'text' : 'password'}
                    className="border-border bg-muted text-foreground placeholder:text-muted-foreground h-11 rounded-lg border pr-10"
                    placeholder="Enter new password"
                    {...register('newPassword', {
                      required: 'New password is required',
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

                {errors.newPassword && <p className="text-destructive mt-1 text-sm">{errors.newPassword.message}</p>}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-foreground text-[13px]">
                  Confirm Password
                </Label>

                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    className="border-border bg-muted text-foreground placeholder:text-muted-foreground h-11 rounded-lg border pr-10"
                    placeholder="Confirm new password"
                    {...register('confirmPassword', {
                      required: 'Please confirm your password',
                      validate: (value) => value === newPassword || 'Passwords do not match',
                    })}
                  />

                  <ShowPassword
                    showPassword={showConfirmPassword}
                    setShowPassword={setShowConfirmPassword}
                    className="absolute top-1/2 right-1 h-10 w-10 -translate-y-1/2"
                  />
                </div>

                {errors.confirmPassword && (
                  <p className="text-destructive mt-1 text-sm">{errors.confirmPassword.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button className="w-full" type="submit" disabled={loading}>
                {loading ? 'Resetting...' : 'Reset Password'}
              </Button>

              {/* Back to Login */}
              <div className="text-center">
                <Link to="/login" className="text-primary text-sm hover:underline">
                  Back to Login
                </Link>
              </div>
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
