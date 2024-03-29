import Credentials from 'next-auth/providers/credentials'

import type { NextAuthConfig } from "next-auth"
import { LoginSchema } from './Schemas'
import { getUserByEmail } from './data/user';
import bcrypt from 'bcryptjs'
import Github from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';

/*
  we use prisma so if we define callbacks in this files callbacks go to middleware check and it break the app ORM not supported
  to handle this we define callbacks in auth.ts (next docs)
*/

export default {
  // OAuth login signup which dont require password
  providers: [
    Github({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      async authorize(credentials) {
        // dual safe parse credentials to prevent user to directly use server (user should only POST request credentials from client and not from like postman)
        const validatedFields = LoginSchema.safeParse(credentials);
        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const user = await getUserByEmail(email);
          // null if user not exist or user uses OAuth during register time (OAuth dont have password)
          if (!user || !user.password) return null;

          const passwordMatch = await bcrypt.compare(password, user.password);
          if (passwordMatch) return user;
        }
        return null;
      }
    })
  ],
} satisfies NextAuthConfig