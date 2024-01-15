"use server"

import { LoginSchema } from "@/Schemas";
import { z } from "zod";


export const login = async (values: z.infer<typeof LoginSchema>) => {
    console.log('login called ', values);
    return {error: 'you logged in'};
    return {success: 'you logged in'};
}