"use server"

import { LoginSchema } from "@/Schemas";
import { getUserByEmail } from "@/data/user";
import { z } from "zod";
import  bcrypt  from 'bcryptjs'


export const login = async (values: z.infer<typeof LoginSchema>) => {
    const validatedFields = LoginSchema.safeParse(values);

    if (!validatedFields) {
        return { error: "Invalid fields" };
    }
    if (!validatedFields.success) {
        return null;
    }
    const { email, password } = validatedFields.data;
    const existingUser = await getUserByEmail(email);

    if (!existingUser || !existingUser.email) {
        return { error: "Email not found" };
    }

    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if(!passwordMatch){
        return {error: "Invalid password"};
    }

    return { success: "confirmation email sent!" };
}