import LoginButton from '@/components/auth/login-button'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Poppins } from 'next/font/google'

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"]
})

export default function Home() {
  return (
    <main className="flex h-full space-y-5 flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800">
      <div className='text-white text-center space-y-4'>
        <h1 className={cn("text-6xl font-semibold text-white drop-shadow-md", font.className)}>🔐Auth</h1>
        <div>Login to access dashboard</div>
        <LoginButton mode="redirect" asChild>
          <Button size="lg" variant="secondary">
            Login
          </Button>
        </LoginButton>
      </div>
    </main>
  )
}
