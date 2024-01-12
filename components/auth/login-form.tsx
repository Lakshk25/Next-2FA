'use client';
import CardWrapper from './card-wrapper'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { Input } from '../ui/input';
import { Button } from '../ui/button';

const LoginForm = () => {
    const form = useForm();
    const onSubmit = () => {

    }
    return (
        <CardWrapper
            headerLabel='Login to access'
            backButtonLabel='Create an account'
            backButtonHref='/auth/register'
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
                                        <Input placeholder="Enter your email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    <FormControl>
                                        <Input placeholder="Enter your password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button type="submit" className='w-full'>Login</Button>
                </form>
            </Form>

        </CardWrapper>
    )
}

export default LoginForm