import React from 'react'
import { cn } from '@/lib/utils'
import { Poppins } from 'next/font/google'
import { Button } from './ui/button'
import { HomeButton } from './auth/home-button'

const font = Poppins({
    subsets: ["latin"],
    weight: ["600"]
})

const PageNotFound = () => {
    return (
        <main className="flex h-full space-y-5 flex-col items-center justify-center">
            <div className='text-white text-center space-y-4'>
                <h1 className={cn("text-6xl font-semibold text-white drop-shadow-md", font.className)}>🚀 404 Page not found 🚀</h1>
            </div>
            <HomeButton>
                <Button size="lg" variant="secondary">
                    Home
                </Button>
            </HomeButton>
        </main>
    )
}

export default PageNotFound