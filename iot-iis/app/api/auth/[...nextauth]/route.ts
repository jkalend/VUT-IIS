import NextAuth from "next-auth/next"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from 'bcrypt'
import prisma from '@/app/db'

const handler = NextAuth({
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

        let pwd = await bcrypt.hash (password, 10)
        try {
            const user = await prisma.user.findMany({
                where: {
                    username: username,
                },
            })
            if (!user)
                return null
            // let valid = await bcrypt.compare (pwd, user.password)
            // if (!valid)
            //     return null;

            return user
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

    async jwt({ token, user, account }) {
      if (account && user) {
        token.userId = account.userId
        return {
          ...token,
          accessToken: user.token,
          refreshToken: user.refreshToken,
        };
      }

      return token;
    },

    async session({ session, token }) {
      session.user.accessToken = token.accessToken;
      session.user.refreshToken = token.refreshToken;
      session.user.accessTokenExpires = token.accessTokenExpires;
      session.user.userId = token.userId

      return session;
    },
  }
});

export { handler as GET, handler as POST }