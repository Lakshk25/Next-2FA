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


export const login = async (values: z.infer<typeof LoginSchema>) => {
    const validatedFields = LoginSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields" };
    }

    const { email, password, code } = validatedFields.data;
    const existingUser = await getUserByEmail(email);

    if(!existingUser || !existingUser.email || !existingUser.password){
        return { error: "Email not found" };
    }

    // check password (without this when user's account have  two factor enabled if user write wrong password they redirected to 2FA page)
    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if(!passwordMatch){
        return {error: "Invalid password"};
    }

    // send confirmation token on email to verify
    if(!existingUser.emailVerified){
        const verificationToken = await generateVerificationToken(existingUser.email);
        await sendVerificationEmail(verificationToken.email, verificationToken.token);
        return {success: "Email not verified! Confirmation email sent"}
    }

    // if user has enabled twofactor 
    if(existingUser.isTwoFactorEnabled && existingUser.email){
        if(code){
            const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

            if(existingUser.password !== password)

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
            const twoFactorToken = await generateTwoFactorToken(existingUser.email);
            await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token);
            return {twoFactor: true};
        }
    }

    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: DEFAULT_LOGIN_REDIRECT
        });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Invalid credentials" };
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