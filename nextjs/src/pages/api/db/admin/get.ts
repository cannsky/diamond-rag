import sqlite3 from 'sqlite3';
import { Database } from 'sqlite';
import { checkString } from '../../data/utils/dataUtils';

export const getContexts = async (db: Database<sqlite3.Database, sqlite3.Statement>) => {
    // Get all contexts
    const contexts = await db.all('SELECT name FROM contexts');
    // Return the contexts
    return contexts;
};

export const getContextPredefinedPrompts = async (db: Database<sqlite3.Database, sqlite3.Statement>, contextName: string) => {
    // Check if the contextName is a string, not null, doesn't contain special characters
    if (!checkString(contextName)) return;
    // Get all prompts for a given context
    const prompts = await db.all(
        `SELECT p.* FROM contextPredefinedPrompts cp 
        JOIN predefinedPrompts p ON cp.predefinedPromptId = p.id 
        JOIN contexts c on cp.contextId = c.id
        WHERE c.name = ?
        ORDER BY cp.order ASC`, 
        [contextName]
    );
    // Return the prompts
    return prompts;
}