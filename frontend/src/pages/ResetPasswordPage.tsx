import { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { motion } from 'motion/react'
import { BookOpen, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { authService } from '@/services/api/authService'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getAxiosErrorMessage } from '@/lib/error'
import { useTranslation } from 'react-i18next'

interface ResetPasswordForm {
  newPassword: string
  confirmPassword: string
}

export function ResetPasswordPage() {
  const { t } = useTranslation()
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
      toast.error(t('auth.invalidLink'))
      return
    }

    setLoading(true)
    try {
      await authService.resetPassword(token, data.newPassword)
      toast.success(t('auth.resetSuccess'))
      navigate('/login')
    } catch (error) {
      toast.error(getAxiosErrorMessage(error, t('auth.resetFailed')))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-[#f8f5f2]">
      {/* Background Pattern */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '32px 32px' }}
      />

      {/* Left Column - Branding & Info */}
      <div className="relative hidden w-1/2 flex-col justify-between p-16 lg:flex">
        <Link to="/" className="group flex w-fit items-center gap-2">
          <div className="-rotate-3 rounded-lg bg-black p-2 text-white shadow-md transition-transform duration-300 group-hover:rotate-0">
            <BookOpen className="size-6" />
          </div>
          <h1 className="text-foreground font-serif text-2xl font-bold tracking-tight">
            Journal<span className="text-foreground/40">Feed</span>
          </h1>
        </Link>

        <div className="space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <h2 className="text-foreground/85 font-serif text-5xl leading-tight font-bold">
              {t('auth.renewCommitment').split(' ').slice(0, 2).join(' ')}
              <br />
              <span className="relative inline-block">
                <span className="relative z-10">{t('auth.renewCommitment').split(' ').slice(2).join(' ')}</span>
                <span className="absolute right-0 bottom-1 left-0 z-0 h-3 -rotate-1 bg-yellow-200/60" />
              </span>
            </h2>
            <p className="text-muted-foreground mt-4 font-serif text-lg leading-relaxed">
              {t('auth.securityFoundation')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col gap-4"
          >
            {[t('auth.secureEncrypted'), t('auth.quickEasyUpdate'), t('auth.stayLogged')].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="bg-foreground/30 h-1.5 w-1.5 rounded-full" />
                <span className="text-muted-foreground text-sm font-medium">{item}</span>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="flex gap-3">
          {[
            { color: 'bg-[#fefce8]', rotate: '-rotate-2', label: t('auth.safety') },
            { color: 'bg-[#f0f9ff]', rotate: 'rotate-1', label: t('auth.modern') },
            { color: 'bg-[#fdf2f8]', rotate: '-rotate-1', label: t('auth.private') },
          ].map((note, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className={`${note.color} ${note.rotate} flex h-28 w-28 items-end p-4 shadow-md`}
              style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)' }}
            >
              <span className="text-foreground/50 font-serif text-xs font-bold">{note.label}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="relative flex w-full items-center justify-center p-8 lg:w-1/2">
        <div className="absolute inset-0 border-l border-black/5 lg:bg-white/60 lg:backdrop-blur-sm" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="mb-10 flex items-center gap-2 lg:hidden">
            <div className="-rotate-3 rounded-lg bg-black p-2 text-white shadow-md">
              <BookOpen className="size-5" />
            </div>
            <h1 className="font-serif text-xl font-bold tracking-tight">
              Journal<span className="text-foreground/40">Feed</span>
            </h1>
          </div>

          {!token ? (
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-red-200 bg-red-100/50">
                  <AlertCircle className="size-8 text-red-600" />
                </div>
              </div>
              <h3 className="text-foreground/90 font-serif text-3xl font-bold">{t('auth.invalidLink')}</h3>
              <p className="text-muted-foreground mt-3 leading-relaxed">{t('auth.invalidLinkDesc')}</p>
              <div className="mt-8">
                <Button
                  className="h-11 w-full rounded-xl font-serif text-base shadow-md transition-all hover:shadow-lg"
                  asChild
                >
                  <Link to="/forgot-password">{t('common.send')}</Link>
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h3 className="text-foreground/90 font-serif text-3xl font-bold">{t('auth.resetPasswordTitle')}</h3>
                <p className="text-muted-foreground mt-1 text-sm">{t('auth.resetPasswordDesc')}</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-3">
                  <div className="relative">
                    <Lock className="text-muted-foreground absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder={t('auth.newPassword')}
                      className="h-11 rounded-xl border-black/10 bg-white pr-10 pl-10 text-sm focus:border-black/25"
                      {...register('newPassword', {
                        required: t('auth.passwordRequired'),
                        minLength: { value: 6, message: t('auth.passwordMinLength') },
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3.5 -translate-y-1/2 transition-colors"
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                    {errors.newPassword && (
                      <span className="ml-1 text-xs text-red-500">{errors.newPassword.message}</span>
                    )}
                  </div>

                  <div className="relative">
                    <Lock className="text-muted-foreground absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder={t('auth.confirmNewPassword')}
                      className="h-11 rounded-xl border-black/10 bg-white pr-10 pl-10 text-sm focus:border-black/25"
                      {...register('confirmPassword', {
                        required: t('auth.confirmPasswordRequired'),
                        validate: (value) => value === newPassword || t('auth.passwordsMustMatch'),
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3.5 -translate-y-1/2 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                    {errors.confirmPassword && (
                      <span className="ml-1 text-xs text-red-500">{errors.confirmPassword.message}</span>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="h-11 w-full rounded-xl font-serif text-base shadow-md transition-all hover:shadow-lg"
                >
                  {loading ? t('common.loading') : t('auth.updatePassword')}
                </Button>
              </form>

              <p className="text-muted-foreground mt-8 text-center text-sm">
                {t('common.alreadyHaveAccount')}{' '}
                <Link
                  to="/login"
                  className="text-foreground hover:text-foreground/70 font-semibold underline underline-offset-4 transition-colors"
                >
                  {t('common.signIn')}
                </Link>
              </p>
            </>
          )}
        </motion.div>
      </div>
    </div>
  )
}
