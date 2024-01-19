"use server";

import { ResetSchema } from "@/Schemas";
import { getUserByEmail } from "@/data/user";
import { sendPasswordResetEmail } from "@/lib/mail";
import { generatePasswordResetToken } from "@/lib/tokens";
import { z } from "zod";

export const reset = async(values: z.infer<typeof ResetSchema>) => {
    const validatedFields = ResetSchema.safeParse(values);

    if(!validatedFields.success){
        return {error: "Invalid email!"};
    }

    const {email} = validatedFields.data;

    // check user exist or not
    const existingUser = await getUserByEmail(email);

    if(!existingUser){
        return {error: "Email not found!"};
    }

    // generate token and send token via user email with verification link
    const passwordResetToken = await generatePasswordResetToken(email);
    await sendPasswordResetEmail(passwordResetToken.email, passwordResetToken.token);
    return {success: "Reset email sent!"}
}