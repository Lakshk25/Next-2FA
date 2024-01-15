'use client';
import CardWrapper from './card-wrapper'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { RegisterSchema } from '@/Schemas';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { register } from '@/actions/register';
import { FormSuccess } from './form-success';
import { FormError } from './form-error';

const RegisterForm = () => {
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        }
    });
    const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
        setError("");
        setSuccess("");
        register(values)
            .then((data) => {
                setSuccess(data.success);
                setError(data.error);
            })
    }
    return (
        <CardWrapper
            headerLabel='Create an account'
            backButtonLabel='already have an account'
            backButtonHref='/auth/login'
            showSocial>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className='space-y-6'>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className='space-y-4'>
                                    <FormControl>
                                        <Input type='name' placeholder="Enter your name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className='space-y-4'>
                                    <FormControl>
                                        <Input type='email' placeholder="Enter your email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem className='space-y-4'>
                                    <FormControl>
                                        <Input type='password' placeholder="Enter your password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormSuccess message={success}/>
                    <FormError message={error}/>
                    <Button type="submit" className='w-full'>Sign up</Button>
                </form>
            </Form>

        </CardWrapper>
    )
}

export default RegisterForm