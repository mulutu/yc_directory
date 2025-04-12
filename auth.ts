import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

import { prisma } from '@/lib/prisma';
 
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub],
  callbacks: {
    async signIn({ user, profile }) {
      // Make sure the user has an email
      if (!user.email) return false;

      // Check if an author with this email already exists
      let existingAuthor = await prisma.author.findUnique({
        where: { email: user.email },
      });

      // If not, create a new author record
      if (!existingAuthor) {
        existingAuthor = await prisma.author.create({
          data: {
            name: user.name || "",
            username: profile?.login || "",
            email: user.email,
            image: user.image || "",
            bio: profile?.bio || "",
          },
        });
      }

      return true;
    },
    async jwt({ token, user }) {
      // When signing in, attach the author's id from the DB to the JWT token
      if (user?.email) {
        const author = await prisma.author.findUnique({
          where: { email: user.email },
        });
        if (author) {
          token.id = author.id;
        }
      }
      return token;
    },
    async session({ session, token }) {
      // Attach the author id from the token to the session.user object
      if (session.user) {
        session.user.id = token.id;
        session.id = token.id; // Attach directly to session as well
      }
      return session;
    },
  },
});
