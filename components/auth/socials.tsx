import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { Button } from '../ui/button';

const Socials = () => {
    return (
        <div className='flex w-full items-center gap-x-2 '>
            <Button size="lg" className='w-full' variant="outline">
                <FcGoogle className='h-7 w-7' />
            </Button>
            <Button size="lg" className='w-full' variant="outline">
                <FaGithub className='h-7 w-7' />
            </Button>

        </div>
    )
}

export default Socials