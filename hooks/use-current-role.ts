import { useSession } from "next-auth/react"

// session from client side
// export user role
export const useCurrentRole = () => {
    const session = useSession();

    return session.data?.user?.role;
}