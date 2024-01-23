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
  // set custom pages otherwise next uses their own prebuilt pages for this
  pages: {
    signIn: "/auth/login",
    error: "/auth/error"
  },
  // if user use OAuth provider dont do email verification their email is already verified by OAuth provider
  events: {
    async linkAccount({ user }){
      await db.user.update({
        where: {id: user.id},
        data: { emailVerified: new Date() }
      });
    }
  },
  callbacks: {
    async signIn({ user, account }){
      // allow OAuth without email verification
      if(account?.provider !== 'credentials') return true;

      const existingUser = await getUserById(user.id);

      // prevent signIn without email verification
      if(!existingUser?.emailVerified)  return false;

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
  // we use prisma ORM so change session to jwt
    adapter: PrismaAdapter(db),
  session: { strategy: "jwt", },
  ...authConfig,
})