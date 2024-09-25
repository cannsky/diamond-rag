import sqlite3 from 'sqlite3';
import { Database } from 'sqlite';
import { checkString } from '../../data/utils/dataUtils';

export const updateAppName = async (db: Database<sqlite3.Database, sqlite3.Statement>, newName: string) => {
    // Check if the newName is a string, not null, doesn't contain special characters
    if (!checkString(newName)) return;
    // Update the app name
    return await db.run('UPDATE data SET appName = ? WHERE id = 1', [newName]);
}