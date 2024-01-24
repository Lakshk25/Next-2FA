"use server";

import { currentRole } from "@/lib/auth";
import { UserRole } from "@prisma/client";

export const admin = async () => {
    const role = await currentRole();
    console.log('tone')
    if(role === UserRole.ADMIN) {
        return {success: "Allowed Server Action!"};
    }
    return {error: "Frobidden Server Action!"}
}