import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { User } from '../types';

// Demo users (in production, use database)
const DEMO_USERS: User[] = [
  {
    id: 'admin-1',
    email: 'admin@example.com',
    password: '$2a$10$8K1p/a9GRGVkUUiUvlMJy.TkW0C7s/oHaAyE9qvr1Gr6oMSKvYgMG', // admin123
    role: 'admin',
    name: 'Admin User',
    created_at: new Date().toISOString(),
  },
  {
    id: 'user-1',
    email: 'user@example.com',
    password: '$2a$10$8K1p/a9GRGVkUUiUvlMJy.TkW0C7s/oHaAyE9qvr1Gr6oMSKvYgMG', // user123
    role: 'user',
    name: 'Regular User',
    created_at: new Date().toISOString(),
  },
];

export const authConfig: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = DEMO_USERS.find(u => u.email === credentials.email);
        if (!user) {
          return null;
        }

        const isValidPassword = await bcrypt.compare(credentials.password, user.password);
        if (!isValidPassword) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    session: async ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
          role: token.role as 'admin' | 'user',
        },
      };
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
  },
};

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string;
      role: 'admin' | 'user';
    };
  }
}