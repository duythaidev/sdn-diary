import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { BookOpen, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { authService } from '@/services/api/authService'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getAxiosErrorMessage } from '@/lib/error'
import { useTranslation } from 'react-i18next'

interface ForgotPasswordForm {
  email: string
}

export function ForgotPasswordPage() {
  const { t } = useTranslation()
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
      toast.success(t('auth.resetEmailSent'))
    } catch (error) {
      toast.error(getAxiosErrorMessage(error, t('auth.resetEmailFailed')))
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
              {t('auth.recoverYourJourney').split(' ').slice(0, 2).join(' ')}
              <br />
              <span className="relative inline-block">
                <span className="relative z-10">{t('auth.recoverYourJourney').split(' ').slice(2).join(' ')}</span>
                <span className="absolute right-0 bottom-1 left-0 z-0 h-3 -rotate-1 bg-yellow-200/60" />
              </span>
            </h2>
            <p className="text-muted-foreground mt-4 font-serif text-lg leading-relaxed">
              {t('auth.dontLetPasswordStop')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col gap-4"
          >
            {[t('auth.secureRecovery'), t('auth.backInMinutes'), t('auth.privacyPriority')].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="bg-foreground/30 h-1.5 w-1.5 rounded-full" />
                <span className="text-muted-foreground text-sm font-medium">{item}</span>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="flex gap-3">
          {[
            { color: 'bg-[#fefce8]', rotate: '-rotate-2', label: t('auth.security') },
            { color: 'bg-[#f0f9ff]', rotate: 'rotate-1', label: t('auth.access') },
            { color: 'bg-[#fdf2f8]', rotate: '-rotate-1', label: t('auth.privacy') },
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

          {emailSent ? (
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-green-200 bg-green-100/50">
                  <CheckCircle2 className="size-8 text-green-600" />
                </div>
              </div>
              <h3 className="text-foreground/90 font-serif text-3xl font-bold">{t('auth.emailSent')}</h3>
              <p className="text-muted-foreground mt-3 leading-relaxed">{t('auth.checkInbox')}</p>
              <div className="mt-8">
                <Button
                  className="h-11 w-full rounded-xl font-serif text-base shadow-md transition-all hover:shadow-lg"
                  asChild
                >
                  <Link to="/login">{t('common.backToLogin')}</Link>
                </Button>
              </div>
              <p className="text-muted-foreground mt-6 text-sm">
                {t('auth.didntReceiveEmail')}{' '}
                <button
                  onClick={() => setEmailSent(false)}
                  className="text-foreground hover:text-foreground/70 font-semibold underline underline-offset-4 transition-colors"
                >
                  {t('common.tryAgain')}
                </button>
              </p>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <Link
                  to="/login"
                  className="text-muted-foreground hover:text-foreground mb-4 flex items-center gap-1.5 text-sm font-medium transition-colors"
                >
                  <ArrowLeft className="size-4" />
                  {t('common.backToLogin')}
                </Link>
                <h3 className="text-foreground/90 font-serif text-3xl font-bold">{t('auth.forgotPasswordTitle')}</h3>
                <p className="text-muted-foreground mt-1 text-sm">{t('auth.forgotPasswordDesc')}</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-3">
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
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="h-11 w-full rounded-xl font-serif text-base shadow-md transition-all hover:shadow-lg"
                >
                  {loading ? t('common.loading') : t('common.send')}
                </Button>
              </form>

              <p className="text-muted-foreground mt-8 text-center text-sm">
                {t('common.dontHaveAccount')}{' '}
                <Link
                  to="/register"
                  className="text-foreground hover:text-foreground/70 font-semibold underline underline-offset-4 transition-colors"
                >
                  {t('common.createAccount')}
                </Link>
              </p>
            </>
          )}
        </motion.div>
      </div>
    </div>
  )
}
