"use server"

import { LoginSchema } from "@/Schemas";
import { getUserByEmail } from "@/data/user";
import { z } from "zod";
import { AuthError } from "next-auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { signIn } from "@/auth";
import { generateTwoFactorToken, generateVerificationToken } from "@/lib/tokens";
import { sendTwoFactorTokenEmail, sendVerificationEmail } from "@/lib/mail";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { db } from "@/lib/db";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";
import bcrypt from 'bcryptjs'

export const login = async (values: z.infer<typeof LoginSchema>, callbackUrl?: string | null) => {
    // this returns object {success , data} success is boolean
    const validatedFields = LoginSchema.safeParse(values);

    // if success is false
    if (!validatedFields.success) {
        return { error: "Invalid fields" };
    }

    const { email, password, code } = validatedFields.data;
    const existingUser = await getUserByEmail(email);

    // if user use OAuth and tries to login with OAuth email return email not found
    // because OAuth registration don't have password field
    if(!existingUser || !existingUser.email || !existingUser.password){
        return { error: "Email not found" };
    }

    // check password (without this when user's account have  two factor enabled if user write wrong password they redirected to 2FA page)
    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if(!passwordMatch){
        return {error: "Invalid password"};
    }

    // send confirmation token on email to verify (if user email is not verified earlier)
    if(!existingUser.emailVerified){
        const verificationToken = await generateVerificationToken(existingUser.email);
        await sendVerificationEmail(verificationToken.email, verificationToken.token);
        return {success: "Email not verified! Confirmation email sent"}
    }

    // if user has enabled twofactor 
    if(existingUser.isTwoFactorEnabled && existingUser.email){
        if(code){
            const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

            if(!twoFactorToken || twoFactorToken === null){
                return {error: "Invalid code!"};
            }

            if(twoFactorToken.token != code){
                return {error: "Invalid code!"};
            }

            const hasExpired = new Date(twoFactorToken.expires) < new Date();
            if(hasExpired){
                return {error: "Code expired"};
            }

            // delete token 
            await db.twoFactorToken.delete({
                where: {id: twoFactorToken.id}
            });

        
            // check if already confirmation set or not 
            const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

            // if already exist delete the old one and create new
            if(existingConfirmation){
                await db.twoFactorConfirmation.delete({
                    where: {id: existingConfirmation.id}
                });
            }

            await db.twoFactorConfirmation.create({
                data: {
                    userId: existingUser.id
                }
            });
        }else{
            // if no code exist generate and send code to email
            const twoFactorToken = await generateTwoFactorToken(existingUser.email);
            await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token);
            return {twoFactor: true};
        }
    }

    // nextjs signIn function to set sesssion and authenticate user (serverless)
    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT
        });
    } catch (error) {
        // errors related to authentication
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Invalid credentials" };
                // if user email is not verify at registration time
                case "AuthorizedCallbackError":
                    return {error: "First confirm your email"};
                default:
                    return { error: "Something went wrong!" };
            }
        }
        throw error;
    }
    return {success: "Confirmation sent"};
}