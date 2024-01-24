import { db } from "@/lib/db";

// check token exist in DB or not with current email
export const getTwoFactorTokenByEmail = async (email: string) => {
    try{
        const twoFactorToken = await db.twoFactorToken.findFirst({
            where: {email}
        });
        return twoFactorToken;
    }catch(error){
        return null;
    }
}