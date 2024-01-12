'use client';
import CardWrapper from './card-wrapper'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { Input } from '../ui/input';
import { Button } from '../ui/button';

const RegisterForm = () => {
    const form = useForm();
    const onSubmit = () => {

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
                            name="username"
                            render={({ field }) => (
                                <FormItem className='space-y-4'>
                                    <FormControl>
                                        <Input placeholder="Enter your name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    <FormControl>
                                        <Input placeholder="Enter your email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    <FormControl>
                                        <Input placeholder="Enter your password" {...field} />
                                    </FormControl>
                                    <FormControl>
                                        <Input placeholder="Confirm your password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button type="submit" className='w-full'>Sign up</Button>
                </form>
            </Form>

        </CardWrapper>
    )
}

export default RegisterForm