import NextAuth from 'next-auth';
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import { initDb } from '../db/connect/init';
import { AppUser } from './interface/appUser';
import { AppSession } from './interface/appSession';

export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: 'Username', type: 'text' },
                password: { label: 'Password', type: 'password' }
            },
            authorize: async (credentials): Promise<AppUser | null> => {
                if(!credentials) return null;
                const db = await initDb();
                const user = await db.get('SELECT * FROM users WHERE username = ?', [credentials.username]);
                if (!user) return null;
                const isValid = await bcrypt.compare(credentials.password, user.password);
                if (!isValid) return null;
                return { id: user.id, name: user.username, admin: user.admin };
            }
        })
    ],
    session: {
        strategy: 'jwt',
        maxAge: 24 * 60 * 60
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                const appUser = user as AppUser;
                token.username = appUser.name;
                token.admin = appUser.admin;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                const appSession = session as AppSession;
                appSession.user.name = token.username as string;
                appSession.user.admin = token.admin as number;
                return appSession;
            }
            return session;
        }
    },
}

export default NextAuth(authOptions);