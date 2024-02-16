import { useSession } from "next-auth/react"

// session from client side
// reusable hook to get current user
export const useCurrentUser = () => {
    const session = useSession();

    return session?.data?.user;
}