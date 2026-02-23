import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { BookOpen, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { useForm } from 'react-hook-form'
import { authService } from '@/services/api/authService'
import { useProfile } from '@/hooks/useProfile'
import { toast } from 'sonner'
import { getAxiosErrorMessage } from '@/lib/error'
import { useTranslation } from 'react-i18next'

interface LoginForm {
  email: string
  password: string
}

export function LoginPage() {
  const { t } = useTranslation()
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
      toast.success(t('auth.loginSuccess'))
      navigate('/dashboard')
    } catch (error) {
      toast.error(getAxiosErrorMessage(error, t('auth.loginFailed')))
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    const googleAuthUrl = authService.getGoogleAuthUrl()
    window.location.href = googleAuthUrl
  }

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

        <div className="space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <h2 className="text-foreground/85 font-serif text-5xl leading-tight font-bold">
              {t('auth.everyThoughtDeservesAPage').split('.')[0]}
              <br />
              <span className="relative inline-block">
                <span className="relative z-10">{t('auth.everyThoughtDeservesAPage').split('.')[1] || ''}.</span>
                <span className="absolute right-0 bottom-1 left-0 -z-0 h-3 -rotate-1 bg-yellow-200/60" />
              </span>
            </h2>
            <p className="text-muted-foreground mt-4 font-serif text-lg leading-relaxed">
              {t('auth.yourPrivateSpace')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col gap-4"
          >
            {[t('auth.keepDailyStreak'), t('auth.shareEntriesPublicly'), t('auth.discoverOthersStories')].map(
              (item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="bg-foreground/30 h-1.5 w-1.5 rounded-full" />
                  <span className="text-muted-foreground text-sm font-medium">{item}</span>
                </div>
              ),
            )}
          </motion.div>
        </div>

        <div className="flex gap-3">
          {[
            { color: 'bg-[#fefce8]', rotate: '-rotate-2', label: t('auth.gratitude') },
            { color: 'bg-[#f0f9ff]', rotate: 'rotate-1', label: t('auth.dreams') },
            { color: 'bg-[#fdf2f8]', rotate: '-rotate-1', label: t('auth.ideas') },
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
            <h3 className="text-foreground/90 font-serif text-3xl font-bold">{t('auth.welcomeBack')}</h3>
            <p className="text-muted-foreground mt-1 text-sm">{t('auth.signInToContinue')}</p>
          </div>

          <div className="space-y-4">
            <button
              type="button"
              onClick={handleGoogleLogin}
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
              {t('auth.continueWithGoogle')}
            </button>

            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-black/8" />
              <span className="text-muted-foreground text-xs font-medium">{t('auth.orContinueWithEmail')}</span>
              <div className="h-px flex-1 bg-black/8" />
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-3">
                <div className="relative">
                  <Mail className="text-muted-foreground absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
                  <Input
                    type="email"
                    placeholder={t('common.email')}
                    className="h-11 rounded-xl border-black/10 bg-white pl-10 text-sm focus:border-black/25"
                    {...register('email', { required: t('auth.emailRequired') })}
                  />
                  {errors.email && <span className="ml-1 text-xs text-red-500">{errors.email.message}</span>}
                </div>

                <div className="relative">
                  <Lock className="text-muted-foreground absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('common.password')}
                    className="h-11 rounded-xl border-black/10 bg-white pr-10 pl-10 text-sm focus:border-black/25"
                    {...register('password', { required: t('auth.passwordRequired') })}
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
              </div>

              <div className="flex justify-end">
                <Link to="/forgot-password">
                  <button
                    type="button"
                    className="text-muted-foreground hover:text-foreground text-xs font-medium transition-colors"
                  >
                    {t('common.forgotPassword')}
                  </button>
                </Link>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="h-11 w-full rounded-xl font-serif text-base shadow-md transition-all hover:shadow-lg"
              >
                {loading ? t('common.loading') : t('common.signIn')}
              </Button>
            </form>
          </div>

          <p className="text-muted-foreground mt-6 text-center text-sm">
            {t('common.dontHaveAccount')}{' '}
            <Link
              to="/register"
              className="text-foreground hover:text-foreground/70 font-semibold underline underline-offset-4 transition-colors"
            >
              {t('common.createAccount')}
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
