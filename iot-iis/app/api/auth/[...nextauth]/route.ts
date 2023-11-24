import NextAuth from "next-auth"
import type { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from 'bcrypt'
import prisma from '@/app/db'
import { useRouter } from "next/router"

export const authOptions: AuthOptions ={
  providers: [
    CredentialsProvider({
      name: 'iis-iot',
      credentials: {
        username: {
          label: 'username',
          type: 'text',
          placeholder: 'username',
        },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        const {username, password} = credentials

        try {
            const user = await prisma.user.findMany({
                where: {
                    username: username,
                },
            })
            if (!user)
                return null
            let valid = await bcrypt.compare (password, user[0].password)
            if (!valid)
                return null

            return user[0]
        }
        catch (err) {
            return null;
        }
      },
    }),
  ],
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: '/profile/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      
      if (user) {
        token.is_admin = user.admin_flag
        token.username = user.username
        return {
          ...token,
          accessToken: user.token,
          refreshToken: user.refreshToken,
        };
      }

      return token;
    },

    async session({ session, token }) {
      session.user.accessToken = token.accessToken
      session.user.refreshToken = token.refreshToken
      session.user.accessTokenExpires = token.accessTokenExpires
      session.user.username = token.username
      session.is_admin = token.is_admin
      return session;
    },
    async signIn({ user, account, profile, email, credentials }) {
      return true
    },
  }
};
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }