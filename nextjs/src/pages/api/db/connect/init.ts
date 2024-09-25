import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import { join } from 'path';
import fs from 'fs';
import { createDb } from './create';

const dbFilePath = join(process.cwd(), 'database.sqlite');

export const initDb = async (): Promise<Database<sqlite3.Database, sqlite3.Statement>> => {
    // Check if the database file exists, if not create it
    if (!fs.existsSync(dbFilePath)) return await createDb();
    // Open the database if it exists
    else return await open({filename: dbFilePath, driver: sqlite3.Database});
};