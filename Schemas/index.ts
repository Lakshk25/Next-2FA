import { z } from "zod";

export const LoginSchema = z.object({
    email: z.string().email({
        message: "Email is required"
    }),
    password: z.string().min(6, {
        message: " minimum 6 character password is required"
    }).max(50, {
        message: "maximum 50 characters"
    })
})

export  const RegisterSchema = z.object({
    name: z.string().min(3, {
        message: "Minimum 3 characters are required"
    }),
    email: z.string().email({
        message: "Email is required"
    }),
    password: z.string().min(6, {
        message: " minimum 6 character password is required"
    }).max(50, {
        message: "maximum 50 characters"
    })
})