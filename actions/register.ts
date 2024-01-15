"use server"

import { RegisterSchema } from "@/Schemas";
import { z } from "zod";
import  bcrypt  from 'bcryptjs'
import { getUserByEmail } from "@/data/user";
import { db } from "@/lib/db";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    const validatedFields = RegisterSchema.safeParse(values);

    if(!validatedFields.success){
        return {error: "Invalid fields"};
    }
    const {name, email, password} = validatedFields.data;

    const hashPassword = await bcrypt.hash(password, 10);

    const existingUser = await getUserByEmail(email);

    if(existingUser){
        return {error: "This email already in use"};
    }
    await db.user.create({
        data: {
            name,
            email,
            password: hashPassword
        }
    })
    return {success: 'account created'};
}