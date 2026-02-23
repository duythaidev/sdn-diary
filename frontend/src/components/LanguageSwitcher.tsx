import { useTranslation } from 'react-i18next'
import { Button } from './ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Languages } from 'lucide-react'

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation()

  const toggleLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Languages className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => toggleLanguage('vi')}>Tiếng Việt</DropdownMenuItem>
        <DropdownMenuItem onClick={() => toggleLanguage('en')}>English</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
