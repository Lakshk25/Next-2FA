import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'

interface backButtonProps {
    label: string,
    href: string
}

const BackButton = ({
    label,
    href
}: backButtonProps
) => {
    return (
        <Button variant="link" className='w-full'><Link href={href}>{label}</Link></Button>
    )
}

export default BackButton