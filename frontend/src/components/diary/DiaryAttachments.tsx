import { Image, X } from 'lucide-react'
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip'
import ImageViewer_Basic from '@/components/commerce-ui/image-viewer-basic'

interface DiaryAttachmentsProps {
  coverPhoto: string | null
  fileInputRef: React.RefObject<HTMLInputElement | null>
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onRemove: () => void
}

export const DiaryAttachments = ({ coverPhoto, fileInputRef, onChange, onRemove }: DiaryAttachmentsProps) => {
  return (
    <div>
      <input ref={fileInputRef} type="file" accept="image/*" onChange={onChange} className="hidden" />

      {coverPhoto ? (
        <div className="group relative overflow-hidden rounded-lg">
          <ImageViewer_Basic thumbnailUrl={coverPhoto} imageUrl={coverPhoto} />

          <div className="absolute top-2 right-2">
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={onRemove}
                    className="rounded-full bg-red-500 p-2 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="left" sideOffset={10}>
                  Remove cover photo
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef?.current?.click()}
          className="border-border hover:border-primary/50 flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 transition-colors"
        >
          <Image className="text-muted-foreground h-8 w-8" />
          <span className="text-muted-foreground text-sm">Add cover photo (5MB max)</span>
        </button>
      )}
    </div>
  )
}
