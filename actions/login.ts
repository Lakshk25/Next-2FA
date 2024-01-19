"use server"

import { LoginSchema } from "@/Schemas";
import { getUserByEmail } from "@/data/user";
import { z } from "zod";
import { AuthError } from "next-auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { signIn } from "@/auth";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";


export const login = async (values: z.infer<typeof LoginSchema>) => {
    const validatedFields = LoginSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields" };
    }

    const { email, password } = validatedFields.data;
    const existingUser = await getUserByEmail(email);
    if(!existingUser || !existingUser.email || !existingUser.password){
        return { error: "Email not found" };
    }

    // send confirmation token on email to verify
    if(!existingUser.emailVerified){
        const verificationToken = await generateVerificationToken(existingUser.email);
        await sendVerificationEmail(verificationToken.email, verificationToken.token);
        return {success: "Email not verified! Confirmation email sent"}
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