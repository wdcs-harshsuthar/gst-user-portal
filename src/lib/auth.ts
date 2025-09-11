import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
        role: { label: 'Role', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        // TODO: Replace with real authentication lookup
        // For now, accept any email/password and pass through role if provided
        return {
          id: credentials.email,
          email: credentials.email,
          name: credentials.email.split('@')[0],
          role: credentials.role || 'user',
        } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role || token.role;
      }
      return token;
    },
    async session({ session, token }) {
      (session as any).role = token.role || 'user';
      return session;
    },
  },
};



