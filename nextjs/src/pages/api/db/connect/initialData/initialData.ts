import sqlite3 from 'sqlite3';
import { Database } from 'sqlite';
import { addInitialContexts } from './initialContexts';
import { addInitialModels } from './initialModels';

export const addInitialData = async (db: Database<sqlite3.Database, sqlite3.Statement>) => {
    // Add initial contexts
    await addInitialContexts(db);
    // Add initial models
    await addInitialModels(db);
};