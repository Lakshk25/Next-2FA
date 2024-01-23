import { getVerificationTokenByEmail } from "@/data/verification-token";
import { v4 as uuidv4} from "uuid"
import { db } from "./db";
import { getPasswordResetTokenByEmail } from "@/data/password-reset-token";
import crypto from "crypto"
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";

export const generateVerificationToken = async (email: string) => {
    const token = uuidv4();
    // expire in 15 min
    const expires = new Date(new Date().getTime() + 15 * 60 * 1000);

    const existingToken = await getVerificationTokenByEmail(email);
    if(existingToken){
        await db.verificationToken.delete({
            where: {
                id: existingToken.id,
            }
        });
    }

    const verificationToken = await db.verificationToken.create({
        data: {
            email,
            token,
            expires
        }
    })
    return verificationToken;
}


export const generatePasswordResetToken = async (email: string) => {
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 3600 * 1000);

    const existingToken = await getPasswordResetTokenByEmail(email);

    // delete old token first
    if(existingToken){
        await db.passwordResetToken.delete({
            where: { id: existingToken.id }
        });
    }

    const passwordResetToken = await db.passwordResetToken.create({
        data:{
            email,
            token,
            expires
        }
    });
    return passwordResetToken;
}

export const generateTwoFactorToken = async (email: string) => {
    const token = crypto.randomInt(100_100, 1_000_000).toString();
    // token expire in 15 min
    const expires = new Date(new Date().getTime() + 15 * 60 * 1000);

    const existingToken = await getTwoFactorTokenByEmail(email);

    if(existingToken){
        await db.twoFactorToken.delete({
            where: {
                id: existingToken.id
            }
        });
    }

    const twoFactorToken = await db.twoFactorToken.create({
        data: {
            email,
            token,
            expires
        }
    })
    return twoFactorToken;
}