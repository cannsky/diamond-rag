import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import { join } from 'path';
import { addInitialData } from './initialData/initialData';

const dbFilePath = join(process.cwd(), 'database.sqlite');

export const createDb = async (): Promise<Database<sqlite3.Database, sqlite3.Statement>> => {
    // Open the database
    const db = await open({
        filename: dbFilePath,
        driver: sqlite3.Database,
    });
    // MODELS TABLE
    await db.exec(`CREATE TABLE IF NOT EXISTS models (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        type TEXT NOT NULL
    )`);
    // DEFAULT MODELS TABLE
    await db.exec(`CREATE TABLE IF NOT EXISTS defaultModels (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        modelId TEXT NOT NULL UNIQUE,
        type TEXT NOT NULL
    )`);
    // USERS TABLE
    await db.exec(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        admin INTEGER NOT NULL DEFAULT 0
    )`);
    // GENERAL APPLICATION DATA TABLE
    await db.exec(`CREATE TABLE IF NOT EXISTS data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        appName TEXT NOT NULL
    )`);
    // JOBS TABLE
    await db.exec(`CREATE TABLE IF NOT EXISTS jobs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        prompt TEXT NOT NULL,
        output TEXT,
        context TEXT NOT NULL,
        iterations INTEGER NOT NULL
    )`);
    // CHATS TABLE
    await db.exec(`CREATE TABLE IF NOT EXISTS chats (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL
    )`);
    // CHAT MESSAGES TABLE
    await db.exec(`CREATE TABLE IF NOT EXISTS chatJobs (
        chatId INTEGER NOT NULL,
        jobId INTEGER NOT NULL,
        PRIMARY KEY (chatId, jobId),
        FOREIGN KEY (chatId) REFERENCES chats(id),
        FOREIGN KEY (jobId) REFERENCES jobs(id)
    )`);
    // PREDEFINED CONTEXT PROMPTS TABLE
    await db.exec(`CREATE TABLE IF NOT EXISTS predefinedPrompts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        prefix TEXT NOT NULL,
        suffix TEXT NOT NULL
    )`);
    // PREDEFINED CONTEXTS TABLE
    await db.exec(`CREATE TABLE IF NOT EXISTS contexts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
    )`);
    // PREDEFINED CONTEXT PREDEFINED PROMPTS TABLE
    await db.exec(`CREATE TABLE IF NOT EXISTS contextPredefinedPrompts (
        contextId INTEGER NOT NULL,
        predefinedPromptId INTEGER NOT NULL,
        sortOrder INTEGER NOT NULL,
        visibility BOOLEAN NOT NULL DEFAULT 0,
        PRIMARY KEY (contextId, sortOrder),
        FOREIGN KEY (contextId) REFERENCES contexts(id),
        FOREIGN KEY (predefinedPromptId) REFERENCES predefinedPrompts(id)
    )`);
    // CONTEXT INPUTS TABLE
    await db.exec(`CREATE TABLE IF NOT EXISTS contextInputs (
        jobId INTEGER NOT NULL,
        sortOrder INTEGER NOT NULL,
        predefinedPromptId INTEGER NOT NULL,
        input TEXT NOT NULL,
        PRIMARY KEY (jobId, sortOrder),
        FOREIGN KEY (jobId) REFERENCES jobs(id)
    )`);
    // CONTEXT OUTPUTS TABLE
    await db.exec(`CREATE TABLE IF NOT EXISTS contextOutputs (
        jobId INTEGER NOT NULL,
        sortOrder INTEGER NOT NULL,
        predefinedPromptId INTEGER NOT NULL,
        output TEXT NOT NULL,
        PRIMARY KEY (jobId, sortOrder),
        FOREIGN KEY (jobId) REFERENCES jobs(id)
    )`);
    // Add the default data
    await db.run('INSERT INTO data (appName) VALUES (?)', ['Diamond AI']);
    // Add the initial data
    await addInitialData(db);
    // Return the database
    return db;
};