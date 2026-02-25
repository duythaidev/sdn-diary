import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Edit } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const CreateDiaryButton = () => {
    const { t } = useTranslation();
    return (
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link to="/diary/create" className="fixed right-6 bottom-6 z-50">
                <Button size="icon" className="h-12 w-12 rounded-full shadow-lg transition-all hover:shadow-xl">
                  <Edit className="h-6 w-6" />
                </Button>
              </Link>
            </TooltipTrigger>

            <TooltipContent side="left" className="text-sm">
              {t('sidebar.createDiary')}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
    );
}

export default CreateDiaryButton;