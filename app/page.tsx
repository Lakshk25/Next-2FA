import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <main className="flex h-full space-y-5 flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800">
      <div className='text-white text-center space-y-4'>
      <div>Login to access dashboard</div>
      <Button size="lg" variant="secondary">
          Login
      </Button>
      </div>
    </main>
  )
}
