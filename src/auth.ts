import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Facebook from "next-auth/providers/facebook"
import LinkedIn from "next-auth/providers/linkedin"
import TikTok from "next-auth/providers/tiktok"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google,
    Facebook,
    LinkedIn,
    TikTok,
  ],
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    // Add user id to session
    session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub
      }
      return session
    },
  },
})
