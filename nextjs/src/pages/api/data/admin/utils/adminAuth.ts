import sqlite3 from 'sqlite3';
import { getServerSession } from 'next-auth/next';
import { getToken } from 'next-auth/jwt';
import { checkIsUserAdmin } from '../../../db/admin/auth';
import authOptions from '../../../auth/[...nextauth]';
import { UserSession } from '../../interface/userSession';
import { NextApiRequest, NextApiResponse } from 'next';
import { Database } from 'sqlite';

export const checkAdminSession = async (db: Database<sqlite3.Database, sqlite3.Statement>, req: NextApiRequest, res: NextApiResponse) : Promise<boolean> => {
    // Get the session
    const session: UserSession | null = await getServerSession(req, res, authOptions);
    // Check if the session is null
    if (!session) return false;
    // Get the token
    const token = await getToken({req});
    // Check if the token is null
    if (!token) return false;
    // Check name of the user
    if (session.user.name != token.name) return false;
    // Check if the user is an admin
    if (token.admin != 1) return false;
    // Check admin validity from database
    const isAdmin = await checkIsUserAdmin(db, session.user.name);
    // Return false if the user is not an admin
    if (!isAdmin) return false;
    // Return true if the session is valid
    return true;
}