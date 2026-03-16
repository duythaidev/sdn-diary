import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { BookOpen, Mail, Lock, Eye, EyeOff, User } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { useForm } from 'react-hook-form'
import { authService } from '@/services/api/authService'
import { useProfile } from '@/hooks/useProfile'
import { toast } from 'sonner'
import { getAxiosErrorMessage } from '@/lib/error'
import { useTranslation } from 'react-i18next'

interface RegisterForm {
  name: string
  email: string
  password: string
  confirm: string
}

export function RegisterPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { setUser } = useProfile()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>()

  const password = watch('password')

  // const strength = (() => {
  //   if (!password) return 0
  //   let s = 0
  //   if (password.length >= 8) s++
  //   if (/[A-Z]/.test(password)) s++
  //   if (/[0-9]/.test(password)) s++
  //   if (/[^A-Za-z0-9]/.test(password)) s++
  //   return s
  // })()

  // const strengthLabel = [
  //   '',
  //   t('auth.strength.weak'),
  //   t('auth.strength.fair'),
  //   t('auth.strength.good'),
  //   t('auth.strength.strong'),
  // ][strength]
  // const strengthColor = ['', 'bg-red-400', 'bg-yellow-400', 'bg-blue-400', 'bg-green-500'][strength]

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true)
    try {
      const response = await authService.register(data.name, data.email, data.password)
      setUser(response.user)
      toast.success(t('auth.registerSuccess'))
      navigate('/diary')
    } catch (error) {
      toast.error(getAxiosErrorMessage(error, t('auth.registerFailed')))
    } finally {
      setLoading(false)
    }
  }

  // const handleGoogleRegister = () => {
  //   const googleAuthUrl = authService.getGoogleAuthUrl()
  //   window.location.href = googleAuthUrl
  // }

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-[#f8f5f2]">
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '32px 32px' }}
      />

      <div className="relative hidden w-1/2 flex-col justify-between p-16 lg:flex">
        <Link to="/" className="group flex w-fit items-center gap-2">
          <div className="-rotate-3 rounded-lg bg-black p-2 text-white shadow-md transition-transform duration-300 group-hover:rotate-0">
            <BookOpen className="size-6" />
          </div>
          <h1 className="text-foreground font-serif text-2xl font-bold tracking-tight">
            Journal<span className="text-foreground/40">Feed</span>
          </h1>
        </Link>

        <div className="space-y-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <h2 className="text-foreground/85 font-serif text-5xl leading-tight font-bold">
              {t('auth.startStoryToday').split(' ').slice(0, 2).join(' ')}
              <br />
              <span className="relative inline-block">
                <span className="relative z-10">{t('auth.startStoryToday').split(' ').slice(2).join(' ')}</span>
                <span className="absolute right-0 bottom-1 left-0 -z-0 h-3 -rotate-1 bg-yellow-200/60" />
              </span>
            </h2>
            <p className="text-muted-foreground mt-4 font-serif text-lg leading-relaxed">{t('auth.joinThousands')}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 gap-4"
          >
            {[
              { value: 'Dành cho', label: t('auth.writers') },
              { value: 'Nhiều thể loại', label: t('auth.entries') },
              { value: t('auth.free'), label: t('auth.always') },
              { value: t('auth.private'), label: t('auth.byDefault') },
            ].map((stat, i) => (
              <div key={i} className="rounded-xl border border-black/5 bg-white/60 p-4 backdrop-blur-sm">
                <div className="text-foreground/85 font-serif text-2xl font-bold">{stat.value}</div>
                <div className="text-muted-foreground mt-0.5 text-xs font-medium">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
{/* 
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl border border-black/5 bg-white/70 p-5 backdrop-blur-sm"
        >
          <p className="text-foreground/70 font-serif text-sm leading-relaxed italic">{t('auth.quote')}</p>
          <p className="text-muted-foreground mt-2 text-xs font-medium">— {t('auth.author')}</p>
        </motion.div> */}
      </div>

      <div className="relative flex w-full items-center justify-center p-8 lg:w-1/2">
        <div className="absolute inset-0 border-l border-black/5 lg:bg-white/60 lg:backdrop-blur-sm" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 w-full max-w-md"
        >
          <div className="mb-10 flex items-center gap-2 lg:hidden">
            <div className="-rotate-3 rounded-lg bg-black p-2 text-white shadow-md">
              <BookOpen className="size-5" />
            </div>
            <h1 className="font-serif text-xl font-bold tracking-tight">
              Journal<span className="text-foreground/40">Feed</span>
            </h1>
          </div>

          <div className="mb-8">
            <h3 className="text-foreground/90 font-serif text-3xl font-bold">{t('common.createAccount')}</h3>
            <p className="text-muted-foreground mt-1 text-sm">{t('auth.createAccountDesc')}</p>
          </div>

          <div className="space-y-4">
            {/* <button
              type="button"
              onClick={handleGoogleRegister}
              className="text-foreground/80 flex h-11 w-full items-center justify-center gap-3 rounded-xl border border-black/10 bg-white text-sm font-medium shadow-xs transition-all hover:border-black/20 hover:bg-black/5"
            >
              <svg className="size-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              {t('auth.signUpWithGoogle')}
            </button> */}
{/* 
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-black/8" />
              <span className="text-muted-foreground text-xs font-medium">{t('auth.orRegisterWithEmail')}</span>
              <div className="h-px flex-1 bg-black/8" />
            </div> */}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <div className="relative">
                <User className="text-muted-foreground absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
                <Input
                  type="text"
                  placeholder={t('common.fullName')}
                  className="h-11 rounded-xl border-black/10 bg-white pl-10 text-sm focus:border-black/25"
                  {...register('name', {
                    required: t('auth.nameRequired'),
                    minLength: { value: 3, message: t('auth.nameMinLength') },
                  })}
                />
                {errors.name && <span className="ml-1 text-xs text-red-500">{errors.name.message}</span>}
              </div>

              <div className="relative">
                <Mail className="text-muted-foreground absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
                <Input
                  type="email"
                  placeholder={t('common.email')}
                  className="h-11 rounded-xl border-black/10 bg-white pl-10 text-sm focus:border-black/25"
                  {...register('email', {
                    required: t('auth.emailRequired'),
                    pattern: { value: /^\S+@\S+\.\S+$/, message: t('auth.invalidEmail') },
                  })}
                />
                {errors.email && <span className="ml-1 text-xs text-red-500">{errors.email.message}</span>}
              </div>

              <div className="space-y-1.5">
                <div className="relative">
                  <Lock className="text-muted-foreground absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('common.password')}
                    className="h-11 rounded-xl border-black/10 bg-white pr-10 pl-10 text-sm focus:border-black/25"
                    {...register('password', {
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
                </div>
                {errors.password && <span className="ml-1 text-xs text-red-500">{errors.password.message}</span>}

                {/* {password && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="px-1"
                  >
                    <div className="mb-1 flex gap-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength ? strengthColor : 'bg-black/10'}`}
                        />
                      ))}
                    </div>
                    <p className="text-muted-foreground text-[11px]">
                      {t('auth.passwordStrength')}:{' '}
                      <span className="text-foreground/70 font-semibold">{strengthLabel}</span>
                    </p>
                  </motion.div>
                )} */}
              </div>

              <div className="relative">
                <Lock className="text-muted-foreground absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
                <Input
                  type={showConfirm ? 'text' : 'password'}
                  placeholder={t('common.confirmPassword')}
                  className="h-11 rounded-xl border-black/10 bg-white pr-10 pl-10 text-sm focus:border-black/25"
                  {...register('confirm', {
                    required: t('auth.confirmPasswordRequired'),
                    validate: (value) => value === password || t('auth.passwordsMustMatch'),
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3.5 -translate-y-1/2 transition-colors"
                >
                  {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {errors.confirm && <span className="ml-1 text-xs text-red-500">{errors.confirm.message}</span>}

              <Button
                type="submit"
                disabled={loading}
                className="mt-2 h-11 w-full rounded-xl font-serif text-base shadow-md transition-all hover:shadow-lg"
              >
                {loading ? t('common.loading') : t('common.createAccount')}
              </Button>
            </form>
          </div>

          <p className="text-muted-foreground mt-6 text-center text-sm">
            {t('common.alreadyHaveAccount')}{' '}
            <Link
              to="/login"
              className="text-foreground hover:text-foreground/70 font-semibold underline underline-offset-4 transition-colors"
            >
              {t('common.signIn')}
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
