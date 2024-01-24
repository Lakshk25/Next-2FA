import { db } from "@/lib/db";

// this only used to check which user enabled 2FA login (app also works without this)
export const getTwoFactorConfirmationByUserId = async (userId: string) => {
    try{
        const twoFactorConfirmation = await db.twoFactorConfirmation.findUnique({
            where: {userId}
        })
        return twoFactorConfirmation;
    }catch(error){
        return null;
    }
}