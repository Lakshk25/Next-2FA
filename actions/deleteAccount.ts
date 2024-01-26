"use server";

import { getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import { logout } from "./logout";
import { db } from "@/lib/db";

export const deleteAccount = async () => {
    const user = await currentUser();
    if (!user) {
        return;
    }
    const dbUser = await getUserById(user.id);
    if (!dbUser) {
        return
    }

    await db.user.delete({
        where: {
            id: dbUser.id,
        },
    })
    await logout();
}