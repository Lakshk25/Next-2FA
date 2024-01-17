// authjs Upgraded guide V5

import { PrismaAdapter } from "@auth/prisma-adapter"
import NextAuth from "next-auth"
import { db } from "./lib/db"
import authConfig from "./auth.config"

// for ORM like prisma we need to change session from database to jwt (authjs Edge compatibility)
export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
    adapter: PrismaAdapter(db),
    session: {strategy: "jwt",},
    ...authConfig,
})