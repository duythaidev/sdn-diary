import { z } from 'zod'
import { useFieldArray, useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { User, Link as LinkIcon, FileText, Plus, X } from 'lucide-react'

const profileFormSchema = z.object({
  username: z
    .string('Please enter your username.')
    .min(2, 'Username must be at least 2 characters.')
    .max(30, 'Username must not be longer than 30 characters.'),

  bio: z.string().max(160).min(4),
  urls: z
    .array(
      z.object({
        value: z.url('Please enter a valid URL.'),
      }),
    )
    .optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

const defaultValues: Partial<ProfileFormValues> = {
  bio: 'I own a computer.',
  urls: [{ value: 'https://shadcn.com' }, { value: 'http://twitter.com/shadcn' }],
}

export function ProfilePage() {
  const form = useForm<ProfileFormValues>({
    defaultValues,
    mode: 'onChange',
  })

  const { fields, append, remove } = useFieldArray({
    name: 'urls',
    control: form.control,
  })

  return (
    <div className="min-h-screen">
      {/* Ambient background effects */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_left,var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />

      <div className="relative container mx-auto max-w-4xl px-6 py-16">
        {/* Header */}
        <div className="mb-12 space-y-3">
          <h1 className="text-4xl font-bold tracking-tight text-white">Settings & Profile</h1>
          <p className="text-lg text-slate-400">Manage your personal details and privacy preferences.</p>
        </div>

        {/* Profile Card */}
        <div className="mb-8 rounded-2xl border border-slate-700/50 bg-slate-800/40 p-8 shadow-2xl backdrop-blur-xl">
          {/* Avatar Section */}
          <div className="mb-8 flex items-center gap-6 rounded-xl border border-slate-700/30 bg-slate-800/60 p-6">
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-cyan-500 to-blue-600 ring-4 ring-slate-800/50">
                <User className="h-10 w-10 text-white" />
              </div>
              <div className="absolute -right-1 -bottom-1 h-6 w-6 rounded-full border-4 border-slate-800 bg-cyan-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white">Alex Doe</h3>
              <p className="text-sm text-slate-400">Journaling since 2023</p>
            </div>
            <div className="flex gap-3">
              <Button className="bg-cyan-500 px-6 font-medium text-white transition-all hover:bg-cyan-600">
                Change Avatar
              </Button>
              <Button
                variant="outline"
                className="border-slate-600 text-slate-300 transition-all hover:bg-slate-700/50 hover:text-white"
              >
                Remove
              </Button>
            </div>
          </div>

          <Form {...form}>
            <form className="space-y-8">
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
                      This is your public display name. It can be your real name or a pseudonym. You can only change
                      this once every 30 days.
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
                              {fields.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="absolute right-2 h-8 w-8 text-slate-400 hover:bg-red-500/10 hover:text-red-400"
                                  onClick={() => remove(index)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              )}
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
                <p className="text-sm text-slate-400">All changes are saved automatically</p>
                <Button type="submit">Update profile</Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}
