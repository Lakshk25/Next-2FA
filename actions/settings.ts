"use server";

import { SettingsSchema } from "@/Schemas";
import { getUserByEmail, getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";
import * as z from "zod";
import bcrypt from 'bcryptjs'
import { update } from "@/auth";


export const settings = async (
    values: z.infer<typeof SettingsSchema>
) => {
    const user = await currentUser();
    if (!user) {
        return { error: "Unauthorized" };
    }

    const dbUser = await getUserById(user.id);

    if (!dbUser) {
        return { error: "Unauthorized" };
    }

    if (user.isOAuth) {
        values.email = undefined;
        values.password = undefined;
        values.newPassword = undefined;
        values.isTwoFactorEnabled = undefined;
    }

    if (values.email && values.email !== user.email) {
        const existingUser = await getUserByEmail(values.email);

        if (existingUser && existingUser.id !== user.id) {
            return { error: "Email already in use!" }
        }

        const verificationToken = await generateVerificationToken(values.email);
        await sendVerificationEmail(verificationToken.email, verificationToken.token);

        return { success: "Verification email sent!" };
    }

    if (values.password && values.newPassword && dbUser.password) {
        const passwordMatch = await bcrypt.compare(
            values.password,
            dbUser.password
        );

        if (!passwordMatch) {
            return { error: "Incorrect password!" };
        }

        const hashedPassword = await bcrypt.hash(values.newPassword, 10);
        values.password = hashedPassword;
        values.newPassword = undefined;
    }
    else {
        // if user type in password field only set password field to undefined so that password wont update in data base
        values = { ...values, password: undefined }
        // delete values.password;  //other way to do this
    }

    // this update , update new information in database
    // now this only update password to new password if user write both old and new password
    const updatedUser = await db.user.update({
        where: { id: dbUser.id },
        data: {
            ...values,
        }
    });

    // this update function for updating new information on client side
    update({
        user: {
            name: updatedUser.name,
            email: updatedUser.email,
            isTwoFactorEnabled: updatedUser.isTwoFactorEnabled,
            role: updatedUser.role,
        }
    })

    return { success: "Settings updated" }
}