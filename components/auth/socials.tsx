"use client";

import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { Button } from '../ui/button';
import { signIn } from 'next-auth/react';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';

const Socials = () => {
    const onClick = (provider: "google" | "github") => {
        signIn(provider, {
            callbackUrl: DEFAULT_LOGIN_REDIRECT,
        })
    }
    return (
        <div className='flex w-full items-center gap-x-2 '>
            <Button size="lg" className='w-full' variant="outline" onClick={() => onClick("google")}>
                <FcGoogle className='h-7 w-7' />
            </Button>
            <Button size="lg" className='w-full' variant="outline" onClick={() => onClick("github")}>
                <FaGithub className='h-7 w-7' />
            </Button>

        </div>
    )
}

export default Socials