'use client';
import CardWrapper from './card-wrapper'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { login } from '@/actions/login';
import { useState, useTransition } from 'react';
import { FormSuccess } from './form-success';
import { FormError } from './form-error';
import { LoginSchema } from '@/Schemas';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

const LoginForm = () => {
    const searchParams = useSearchParams();
    // if email is linked by Another OAuth provider show error (params => "OAuthAccountNotLinked")
    const callbackUrl = searchParams.get("callbackUrl");
    const urlError = searchParams.get("error") === "OAuthAccountNotLinked" ? "Email already in use with different provider!" : "";
    const [isPending, startTransition] = useTransition();
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [showTwoFactor, setShowTwoFactor] = useState(false);

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
            code: ""
        }
    });

    // hide any success or error message after 10 sec
    const hideMessage = async () => {
        setTimeout(() => {
            setError("");
            setSuccess("");
        }, 10000);
    }

    const onSubmit = (values: z.infer<typeof LoginSchema>) => {
        setError("");
        setSuccess("");
        startTransition(() => {
            login(values, callbackUrl)
                .then((data) => {
                    if (data?.success)
                        setSuccess(data?.success);
                    if (data?.error) {
                        setError(data?.error);
                    }
                    if (data?.twoFactor) {
                        setShowTwoFactor(true);
                    }
                })
            hideMessage();
        })
    }
    return (
        <CardWrapper
            headerLabel='Login to access'
            backButtonLabel='Create an account'
            backButtonHref='/auth/register'
            showSocial>

            <Form {...form}>
                {/* if two factor enabled */}
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                        {showTwoFactor && (
                            <FormField control={form.control} name="code" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Code</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={isPending} placeholder="123456" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        )}
                        {/* login page */}
                        {!showTwoFactor &&
                            (<>
                                <FormField control={form.control} name="email" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input {...field} disabled={isPending} placeholder="john.doe@example.com" type="email" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />

                                <FormField control={form.control} name="password" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input {...field} disabled={isPending} placeholder="******" type="password" />
                                        </FormControl>
                                        <Button size="sm" variant="link" asChild className="px-0 font-normal">
                                            <Link href="/auth/reset">Forgot password?</Link>
                                        </Button>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </>)
                        }
                    </div>
                    <FormSuccess message={success} />
                    <FormError message={error || urlError} />
                    <Button type="submit" className='w-full' disabled={isPending}>Login</Button>
                </form>
            </Form>

        </CardWrapper>
    )
}

export default LoginForm