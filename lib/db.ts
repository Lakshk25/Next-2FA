import { PrismaClient } from '@prisma/client';

// (only in development) without this prisma create client on every db operation which causes slow app issues
declare global {
    var prisma: PrismaClient | undefined;
}

// if previous prisma client use that otherwise create new
export const db = globalThis.prisma || new PrismaClient();

if(process.env.NODE_ENV !== 'production') globalThis.prisma = db;