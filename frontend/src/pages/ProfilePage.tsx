import { z } from 'zod'
import { useFieldArray, useForm } from 'react-hook-form'
import { useRef, useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { User, Link as LinkIcon, FileText, Plus, X, Camera, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import ImageViewer_Basic from '@/components/commerce-ui/image-viewer-basic'
import { authService } from '@/services/api/authService'
import { getAxiosErrorMessage } from '@/lib/error'
import { useProfile } from '@/hooks/useProfile'
import type { User as UserType } from '@/types'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const profileFormSchema = z.object({
  username: z
    .string('Please enter your username.')
    .min(2, 'Username must be at least 2 characters.')
    .max(30, 'Username must not be longer than 30 characters.'),
  bio: z.string().max(160).min(4),
  profileImage: z.string().nullable().optional(),
  urls: z
    .array(
      z.object({
        value: z.url('Please enter a valid URL.'),
      }),
    )
    .optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

export function ProfilePage() {
  const [loading, setLoading] = useState(false)
  const [userData, setUserData] = useState<UserType | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { setUser } = useProfile()

  const form = useForm<ProfileFormValues>({
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
      toast.error(getAxiosErrorMessage(error, 'Failed to load profile'))
    }
  }

  // Handle profile image upload
  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file')
        return
      }

      // Validate file size (max 5MB)
      if (file.size > MAX_FILE_SIZE) {
        toast.error('Image size should be less than 5MB')
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
      toast.success('Profile updated successfully')
      fetchUserProfile()
    } catch (error) {
      toast.error(getAxiosErrorMessage(error, 'Failed to update profile'))
    } finally {
      setLoading(false)
    }
  }

  const profileImage = form.watch('profileImage')

  return (
    <div className="min-h-screen">
      {/* Ambient background effects */}

      <div className="relative container mx-auto max-w-4xl px-6 py-6">
        {/* Header */}
        <div className="mb-12 space-y-3">
          <h1 className="text-4xl font-bold tracking-tight text-white">Settings & Profile</h1>
          <p className="text-lg text-slate-400">Manage your personal details and privacy preferences.</p>
        </div>

        {/* Profile Card */}
        <div className="mb-8 rounded-2xl border border-slate-700/50 bg-slate-800/40 p-8 shadow-2xl backdrop-blur-xl">
          <h2 className="mb-6 text-xl font-semibold text-white">Profile Details</h2>

          {/* Avatar Section */}
          <div className="mb-8 flex items-center gap-6 rounded-xl border border-slate-700/30 bg-slate-800/60 p-6">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleProfileImageChange}
              className="hidden"
            />

            <div className="group relative">
              {profileImage ? (
                <div className="relative h-24 w-24 overflow-hidden rounded-full ring-4 ring-slate-800/50">
                  <ImageViewer_Basic thumbnailUrl={profileImage} imageUrl={profileImage} />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                    <Camera className="h-8 w-8 text-white" />
                  </div>
                </div>
              ) : (
                <div className="flex h-24 w-24 cursor-pointer items-center justify-center rounded-full bg-linear-to-br from-cyan-500 to-blue-600 ring-4 ring-slate-800/50 transition-all group-hover:from-cyan-600 group-hover:to-blue-700">
                  <User className="h-12 w-12 text-white" />
                </div>
              )}
              <div className="absolute -right-1 -bottom-1 flex h-7 w-7 items-center justify-center rounded-full border-4 border-slate-800 bg-cyan-500">
                <div className="h-2.5 w-2.5 rounded-full bg-white" />
              </div>
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white">{userData?.username || 'Loading...'}</h3>
              <p className="text-sm text-slate-400">
                Journaling since {userData?.createdAt ? new Date(userData.createdAt).getFullYear() : '2023'}
              </p>
            </div>

            <div className="flex gap-3">
              <Button onClick={() => fileInputRef.current?.click()} type="button">
                <Camera className="mr-2 h-4 w-4" />
                {profileImage ? 'Change' : 'Upload'} Avatar
              </Button>
              {profileImage && (
                <Button
                  type="button"
                  onClick={removeProfileImage}
                  variant="outline"
                  className="border-slate-600 text-slate-300 transition-all hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove
                </Button>
              )}
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Username Field */}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 font-medium text-slate-200">
                      <User className="h-4 w-4 text-cyan-400" />
                      Username
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="shadcn"
                          {...field}
                          className="h-12 border-slate-700 bg-slate-900/50 px-4 text-white transition-all placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/20"
                        />
                      </div>
                    </FormControl>
                    <FormDescription className="text-sm text-slate-400">
                      This is your public display name. It can be your real name or a pseudonym.
                    </FormDescription>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              {/* Bio Field */}
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 font-medium text-slate-200">
                      <FileText className="h-4 w-4 text-cyan-400" />
                      Bio
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us a little bit about yourself"
                        className="min-h-[120px] resize-none border-slate-700 bg-slate-900/50 text-white transition-all placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/20"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-sm text-slate-400">
                      Brief description for your profile. Maximum 160 characters.
                    </FormDescription>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              {/* URLs Section */}
              <div className="space-y-4">
                <FormLabel className="flex items-center gap-2 font-medium text-slate-200">
                  <LinkIcon className="h-4 w-4 text-cyan-400" />
                  URLs
                </FormLabel>
                <FormDescription className="-mt-1 text-sm text-slate-400">
                  Add links to your website, blog, or social media profiles.
                </FormDescription>

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
                                className="h-12 border-slate-700 bg-slate-900/50 pr-12 text-white transition-all placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/20"
                                placeholder="https://example.com"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-2 h-8 w-8 text-slate-400 hover:bg-red-500/10 hover:text-red-400"
                                onClick={() => remove(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-3 border-slate-600 text-slate-300 transition-all hover:border-cyan-500/50 hover:bg-slate-700/50 hover:text-white"
                  onClick={() => append({ value: '' })}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add URL
                </Button>
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-between border-t border-slate-700/50 pt-6">
                <p className="text-sm text-slate-400">Changes will be saved when you click update</p>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Updating...' : 'Update profile'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}
