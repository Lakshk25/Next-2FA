import { UserRole } from "@prisma/client";
import { z } from "zod";


// this schemas is used for form validation (not related to database schema)

export const LoginSchema = z.object({
    email: z.string().email({
        message: "Email is required"
    }),
    password: z.string().min(6, {
        message: " minimum 6 character password is required"
    }).max(50, {
        message: "maximum 50 characters"
    }),
    code: z.optional(z.string())
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

export const ResetSchema = z.object({
    email: z.string().email({
        message: "Email is required"
    }),
});

export const NewPasswordSchema = z.object({
    password: z.string().min(6, {
        message: "Minimum of 6 characters required"
    })
})

export const SettingsSchema = z.object({
    name: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    role: z.enum([UserRole.ADMIN, UserRole.USER]),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(6)),
    newPassword: z.optional(z.string().min(6)),
})