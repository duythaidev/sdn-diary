import { Button } from '../ui/button'

const GoogleButton = ({ handleGoogleLogin }: { handleGoogleLogin: () => void }) => {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleGoogleLogin}
      className="border-border text-foreground flex h-11 w-full items-center justify-center gap-2 rounded-lg border bg-transparent"
    >
      <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="h-5 w-5" />
      Continue with Google
    </Button>
  )
}

export default GoogleButton
