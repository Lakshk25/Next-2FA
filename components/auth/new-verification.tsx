"use client";

import React, { useEffect, useState } from 'react'
import CardWrapper from './card-wrapper'
import { FormSuccess } from './form-success'
import { FormError } from './form-error'
import { BeatLoader } from 'react-spinners'
import { useSearchParams } from 'next/navigation'
import { newVerification } from '@/actions/new-verification'

const NewVerificationForm = () => {
    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();
    const searchParams = useSearchParams();

    const token = searchParams.get('token');

    const onSubmit = () => {
        if(success || error) return;

        if(!token){
            setError("Missing token");
            return;
        };

        newVerification(token)
        .then((data) => {
            setSuccess(data.success);
            setError(data.error);
        })
        .catch((error) => {
            setError("Something went wrong");
            console.log("Something went wrong");
        })
    }

    useEffect(() => {
        onSubmit();
    }, [onSubmit]);

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