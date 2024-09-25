import sqlite3 from 'sqlite3';
import { Database } from 'sqlite';
import { checkString } from '../../data/utils/dataUtils';

export const checkUserId = async (db: Database<sqlite3.Database, sqlite3.Statement>, username: string) : Promise<number> => {
    // Check if the username is a string, not null, doesn't contain special characters
    if (!checkString(username)) return -1;
    // Check if the user exists
    const result = await db.get('SELECT id FROM users WHERE username = ?', [username]);
    // If the user exists, return the id
    if (!result) return -1;
    // Return the id
    return result.id;
};