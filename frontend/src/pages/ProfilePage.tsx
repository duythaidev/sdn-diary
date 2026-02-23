import { z } from 'zod'
import { useFieldArray, useForm } from 'react-hook-form'
import { useRef, useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { User, Link as LinkIcon, Plus, X, Camera, Settings } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import ImageViewer_Basic from '@/components/commerce-ui/image-viewer-basic'
import { authService } from '@/services/api/authService'
import { getAxiosErrorMessage } from '@/lib/error'
import { useProfile } from '@/hooks/useProfile'
import type { User as UserType } from '@/types'
import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

const profileFormSchema = z.object({
  username: z
    .string({ error: 'Please enter your username.' })
    .min(2, 'Username must be at least 2 characters.')
    .max(30, 'Username must not be longer than 30 characters.'),
  bio: z.string().max(160).min(4).optional().or(z.literal('')),
  profileImage: z.string().nullable().optional(),
  urls: z
    .array(
      z.object({
        value: z.string().url('Please enter a valid URL.'),
      }),
    )
    .optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

export function ProfilePage() {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [userData, setUserData] = useState<UserType | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { setUser } = useProfile()

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: '',
      bio: '',
      profileImage: null,
      urls: [],
    },
    mode: 'onChange',
  })

  const { fields, append, remove } = useFieldArray({
    name: 'urls',
    control: form.control,
  })

  // Fetch user data on mount
  useEffect(() => {
    fetchUserProfile()
  }, [])

  const fetchUserProfile = async () => {
    try {
      const response = await authService.getMe()
      setUserData(response.user)
      setUser(response.user)
      form.reset({
        username: response.user.username || '',
        bio: response.user.bio || '',
        profileImage: response.user.profileImage || null,
        urls: response.user.urls || [],
      })
    } catch (error) {
      toast.error(getAxiosErrorMessage(error, t('profile.failedToLoad')))
    }
  }

  // Handle profile image upload
  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error(t('profile.pleaseUploadImage'))
        return
      }

      // Validate file size (max 5MB)
      if (file.size > MAX_FILE_SIZE) {
        toast.error(t('profile.imageTooLarge'))
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        form.setValue('profileImage', reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Remove profile image
  const removeProfileImage = () => {
    form.setValue('profileImage', null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Handle form submission
  const onSubmit = async (data: ProfileFormValues) => {
    setLoading(true)
    try {
      await authService.updateProfile(data)
      toast.success(t('profile.profileUpdated'))
      fetchUserProfile()
    } catch (error) {
      toast.error(getAxiosErrorMessage(error, t('profile.failedToUpdate')))
    } finally {
      setLoading(false)
    }
  }

  const profileImage = form.watch('profileImage')

  return (
    <div className="animate-in fade-in mx-auto max-w-4xl pb-20 duration-500">
      {/* Header */}
      <div className="mb-8 flex items-center gap-3 border-b border-black/5 pb-6">
        <div className="rounded-full bg-black/5 p-2">
          <Settings className="text-foreground/70 size-6" />
        </div>
        <div>
          <h1 className="text-foreground/90 font-serif text-3xl font-bold">{t('profile.settingsAndProfile')}</h1>
          <p className="text-muted-foreground mt-1">{t('profile.settingsSubtitle')}</p>
        </div>
      </div>

      <div className="">
        {/* Main Form Area */}
        <div className="">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-black/5 bg-white p-8 shadow-sm"
          >
            {/* Avatar Section */}
            <div className="mb-10 flex flex-col items-center gap-6 border-b border-dashed border-black/5 pb-8 sm:flex-row">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleProfileImageChange}
                className="hidden"
              />

              <div className="group relative shrink-0">
                {profileImage ? (
                  <div className="h-24 w-24 overflow-hidden rounded-full bg-gray-100 ring-4 ring-black/5">
                    <ImageViewer_Basic thumbnailUrl={profileImage} imageUrl={profileImage} />
                  </div>
                ) : (
                  <div className="flex h-24 w-24 cursor-pointer items-center justify-center rounded-full bg-black/5 ring-4 ring-black/5 transition-all hover:bg-black/10">
                    <User className="text-muted-foreground h-10 w-10" />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-foreground absolute right-0 bottom-0 rounded-full border border-black/10 bg-white p-1.5 shadow-sm hover:bg-gray-50"
                >
                  <Camera className="size-3.5" />
                </button>
              </div>

              <div className="flex-1 text-center sm:text-left">
                <h3 className="mb-1 font-serif text-lg font-bold">{userData?.username || 'Writer'}</h3>
                <p className="text-muted-foreground mb-3 text-sm">{t('profile.maxFileSize')}</p>
                <div className="flex justify-center gap-2 sm:justify-start">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="border-black/10 bg-white hover:bg-gray-50"
                  >
                    {t('common.uploadNew')}
                  </Button>
                  {profileImage && (
                    <Button
                      type="button"
                      onClick={removeProfileImage}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      {t('common.remove')}
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Username Field */}
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground/80 font-bold">{t('profile.username')}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="johndoe"
                          {...field}
                          className="border-black/10 bg-white focus:border-black/20"
                        />
                      </FormControl>
                      <FormDescription>{t('profile.usernameDescription')}</FormDescription>
                      <FormMessage className="text-xs text-red-500" />
                    </FormItem>
                  )}
                />

                {/* Bio Field */}
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground/80 font-bold">{t('profile.bio')}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t('profile.bioPlaceholder')}
                          className="min-h-[100px] resize-none border-black/10 bg-white focus:border-black/20"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>{t('profile.bioDescription')}</FormDescription>
                      <FormMessage className="text-xs text-red-500" />
                    </FormItem>
                  )}
                />

                {/* URLs Section */}
                <div className="space-y-3 border-t border-dashed border-black/5 pt-4">
                  <FormLabel className="text-foreground/80 flex items-center gap-2 font-bold">
                    <LinkIcon className="size-4" />
                    {t('profile.socialLinks')}
                  </FormLabel>

                  <div className="space-y-3">
                    {fields.map((field, index) => (
                      <FormField
                        control={form.control}
                        key={field.id}
                        name={`urls.${index}.value`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div className="relative flex items-center gap-2">
                                <Input
                                  {...field}
                                  className="border-black/10 bg-white focus:border-black/20"
                                  placeholder={t('profile.socialLinksPlaceholder')}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="text-muted-foreground shrink-0 hover:text-red-600"
                                  onClick={() => remove(index)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage className="text-xs text-red-500" />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground mt-2 border-dashed border-black/20 text-xs"
                    onClick={() => append({ value: '' })}
                  >
                    <Plus className="mr-1 h-3 w-3" />
                    {t('common.addLink')}
                  </Button>
                </div>

                {/* Submit Button */}
                <div className="flex items-center justify-end border-t border-black/5 pt-6">
                  <Button type="submit" disabled={loading} className="shadow-md transition-all hover:shadow-lg">
                    {loading ? t('common.saving') : t('common.saveChanges')}
                  </Button>
                </div>
              </form>
            </Form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
