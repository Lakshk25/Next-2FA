import { cn } from '@/lib/utils';
import { Poppins } from 'next/font/google'
import React from 'react'

interface headerProp{
    label: string
}

const font = Poppins({
    subsets: ["latin"],
    weight: ["600"],
});

const Header = ({
    label
}: headerProp) => {
  return (
    <h1 className={cn("w-full text-center text-2xl", font.className)}>{label}</h1>
  )
}

export default Header