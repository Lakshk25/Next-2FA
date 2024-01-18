// authjs Upgraded guide V5

import { PrismaAdapter } from "@auth/prisma-adapter"
import NextAuth from "next-auth"
import { db } from "./lib/db"
import authConfig from "./auth.config"
import { getUserById } from "./data/user"
import { UserRole } from "@prisma/client"

// for ORM like prisma we need to change session from database to jwt (authjs Edge compatibility)

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut
} = NextAuth({
  callbacks: {
    async signIn({ user, account }){
      if(account?.provider){
        console.log("PROVIDER -> ", account);
      }
      return true;
    },
    async session({ token, session }) {
      // add user id in session using token
      if(token.sub && session.user){
        session.user.id = token.sub
      }

      // add role in session from token
      if(token.role && session.user){
        session.user.role = token.role as UserRole;
      }
      return session;
    },
    // first jwt runs then session runs
    async jwt({ token, user, profile }) {
      if(!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if(!existingUser) return token;

      // add role in JWT token
      token.role = existingUser.role;
      return token;
    },
  },
    adapter: PrismaAdapter(db),
  session: { strategy: "jwt", },
  ...authConfig,
})