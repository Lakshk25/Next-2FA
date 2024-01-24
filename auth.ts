// authjs Upgraded guide V5

import { PrismaAdapter } from "@auth/prisma-adapter"
import NextAuth from "next-auth"
import { db } from "./lib/db"
import authConfig from "./auth.config"
import { getUserById } from "./data/user"
import { UserRole } from "@prisma/client"
import { getAccountByUserId } from "./data/account"
import { getTwoFactorConfirmationByUserId } from "./data/two-factor-confirmation"

// for ORM like prisma we need to change session from database to jwt (authjs Edge compatibility)

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
  update
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
  // callbacks are side effect which we can used to check any certain conditions
  callbacks: {
    async signIn({ user, account }){
      // allow OAuth without email verification
      if(account?.provider !== 'credentials') return true;

      const existingUser = await getUserById(user.id);

      // prevent signIn without email verification
      if(!existingUser?.emailVerified)  return false;

      if(existingUser.isTwoFactorEnabled){
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

        if(!twoFactorConfirmation) return false;

        // delete two factor confirmation for next sign in

        await db.twoFactorConfirmation.delete({
          where: {id: twoFactorConfirmation.id}
        });
      }
      return true;
    },
    //  session works when jwt is defined
    // session contain user logged in information we can also add our custom fields in session (first in jwt)
    // (used this session in /settings page)
    async session({ token, session }) {
      // add user id in session using token
      if(token.sub && session.user){
        session.user.id = token.sub
      }

      // add role in session from token
      // session.user.role = token.role  -> this also works but it gives TS error
      if(token.role && session.user){
        session.user.role = token.role as UserRole;
      }

      if(session.user){
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.isOAuth = token.isOAuth as boolean;
      }

      return session;
    },
    // first jwt runs then session runs
    async jwt({ token}) {
      // if no sub (id ) means no user is logged in currently
      if(!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      // no user means token is null so return it
      if(!existingUser) return token;

      const existingAccount = await getAccountByUserId(existingUser.id);
      // add properties in JWT token  (custom property) which we can use in session
      token.isOAuth = !!existingAccount;  // if false -> user use email for signin if true user use OAuth provider
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;

      return token;
    },
  },
  // we use prisma ORM so change session to jwt
    adapter: PrismaAdapter(db),
  session: { strategy: "jwt", },
  ...authConfig,
})