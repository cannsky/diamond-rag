import sqlite3 from 'sqlite3';
import { getServerSession } from 'next-auth/next';
import { getToken } from 'next-auth/jwt';
import { checkUserId } from '../../../db/user/auth';
import authOptions from '../../../auth/[...nextauth]';
import { UserSession } from '../../interface/userSession';
import { NextApiRequest, NextApiResponse } from 'next';
import { Database } from 'sqlite';

export const checkUserSession = async (db: Database<sqlite3.Database, sqlite3.Statement>, req: NextApiRequest, res: NextApiResponse) : Promise<number> => {
    // Get the session
    const session: UserSession | null = await getServerSession(req, res, authOptions);
    // Check if the session is null
    if (!session) return -1;
    // Get the token
    const token = await getToken({req});
    // Check if the token is null
    if (!token) return -1;
    // Check name of the user
    if (session.user.name != token.name) return -1;
    // Check the id of the user
    const userId = await checkUserId(db, session.user.name);
    // Return the user id
    return userId;
}