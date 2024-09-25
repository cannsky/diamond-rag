import sqlite3 from 'sqlite3';
import { Database } from 'sqlite';
import { checkString } from '../../data/utils/dataUtils';

export const checkIsUserAdmin = async (db: Database<sqlite3.Database, sqlite3.Statement>, username: string) : Promise<boolean> => {
    // Check if the username is a string, not null, doesn't contain special characters
    if (!checkString(username)) return false;
    // Check if the user is an admin
    const result = await db.get('SELECT admin FROM users WHERE username = ?', [username]);
    // If the user is an admin, return true
    if (result && result.admin === 1) return true;
    // If the user is not an admin, return false
    else return false;
};