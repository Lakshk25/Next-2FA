import { db } from "@/lib/db";

export const getTwoFactorToken = async (token: string) => {
    try{
        const twoFactorToken = await db.twoFactorToken.findUnique({
            where: {token}
        });
        console.log(twoFactorToken);
        return twoFactorToken;
    }catch(error){
        return null;
    }
}

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