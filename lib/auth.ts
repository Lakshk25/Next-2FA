
import { auth } from "@/auth"

// return user from current session (logged in)
export const currentUser = async () => {
    const session = await auth();
    return session?.user;
}

export const currentRole = async () => {
    const session = await auth();

    return session?.user?.role;
}