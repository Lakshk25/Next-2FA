import { db } from "@/lib/db"

// for OAuth providers 
export const getAccountByUserId = async (userId: string) => {
    try {
        const account = await db.account.findFirst({
            where: {userId}
        })
        return account;
    } catch (error) {
        return null;
    }
}