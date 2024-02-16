"use client";

// verification component which check 6 digit code sent to email
import React, { useCallback, useEffect, useState } from 'react'
import CardWrapper from './card-wrapper'
import { FormSuccess } from './form-success'
import { FormError } from './form-error'
import { BeatLoader } from 'react-spinners'
import { redirect, useSearchParams } from 'next/navigation'
import { newVerification } from '@/actions/new-verification'

const NewVerificationForm = () => {
    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();

    // check token in valid url
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const onSubmit = useCallback(() => {
        if (success || error) return;

        if (!token) {
            setError("Missing token");
            return;
        };

        newVerification(token)
            .then((data) => {
                setSuccess(data.success);
                setError(data.error);
                if (data.success) {
                    redirect('/auth/login');
                }
            })
            .catch((error) => {
                setError("Something went wrong");
            })
    }, [token, success, error])

    useEffect(() => {
        onSubmit();
    }, [onSubmit, success, token]);

    return (
        <CardWrapper
            headerLabel="Confirming your verificatrion"
            backButtonLabel="Back to login"
            backButtonHref="/auth/login"
        >
            <div className="flex items-center w-full justify-center">
                {!success && !error && (
                    <BeatLoader />
                )}
                <FormSuccess message={success} />
                {!success && (
                    <FormError message={error} />
                )}

            </div>
        </CardWrapper>
    )
}

export default NewVerificationForm