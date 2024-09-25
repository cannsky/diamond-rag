import sqlite3 from 'sqlite3';
import { Database } from 'sqlite';
import { checkString } from '../../data/utils/dataUtils';

export const updateJobOutput = async (db: Database<sqlite3.Database, sqlite3.Statement>, jobId: number, output: string) => {
    // Check if the output is a string, not null, doesn't contain special characters
    // if (!checkString(output)) return;
    // Update job output
    return await db.run('UPDATE jobs SET output = ? WHERE id = ?', [output, jobId]);
}