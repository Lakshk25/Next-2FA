import Link from 'next/link'
import { Button } from '../ui/button'

interface backButtonProps {
    label: string,
    href: string
}

// form back button
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