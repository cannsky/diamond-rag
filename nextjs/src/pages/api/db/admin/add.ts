import sqlite3 from 'sqlite3';
import { Database } from 'sqlite';
import { checkString } from '../../data/utils/dataUtils';

export const addContext = async (db: Database<sqlite3.Database, sqlite3.Statement>, name: string) => {
    // Check if the name is a string, not null, doesn't contain special characters
    if (!checkString(name)) return;
    // Check if there is already a context with the same name
    const existingContext = await db.get('SELECT * FROM contexts WHERE name = ?', [name]);
    // If there is already a context with the same name, do nothing
    if (existingContext) return;
    // Add context
    return await db.run('INSERT INTO contexts (name) VALUES (?)', [name]);
}

export const addPredefinedPrompt = async (db: Database<sqlite3.Database, sqlite3.Statement>, name: string, type: string, prefix: string, suffix: string) => {
    // Check if the name, type, prefix, and suffix are strings, not null, don't contain special characters
    if (!checkString(name) || !checkString(type) || !checkString(prefix, true) || !checkString(suffix, true)) return
    // Check if there is already a prompt with the same name
    const existingPrompt = await db.get('SELECT * FROM predefinedPrompts WHERE name = ?', [name]);
    // If there is already a prompt with the same name, do nothing
    if (existingPrompt) return;
    // Add prompt
    return await db.run('INSERT INTO predefinedPrompts (name, type, prefix, suffix) VALUES (?, ?, ?, ?)', [name, type, prefix, suffix]);
}

export const addContextPredefinedPrompt = async (db: Database<sqlite3.Database, sqlite3.Statement>, contextName: string, predefinedPromptName: string, sortOrder: number) => {
    // Check if the contextName and predefinedPromptName are strings, not null, don't contain special characters
    if (!checkString(contextName) || !checkString(predefinedPromptName)) return;
    // Get the context
    const context = await db.get('SELECT id FROM contexts WHERE name = ?', [contextName]);
    // If there is no context with the same name, do nothing
    if (!context) return;
    // Get the prompt
    const prompt = await db.get('SELECT id FROM predefinedPrompts WHERE name = ?', [predefinedPromptName]);
    // If there is no prompt with the same name, do nothing
    if (!prompt) return;
    // Check if there is already a prompt with the same contextId and sortOrder
    const existingPrompt = await db.get('SELECT * FROM contextPredefinedPrompts WHERE contextId = ? AND sortOrder = ?', [context.id, sortOrder]);
    // If there is already a prompt with the same contextId and sortOrder, do nothing
    if (existingPrompt) return;
    // Add context prompt
    return await db.run('INSERT INTO contextPredefinedPrompts (contextId, predefinedPromptId, sortOrder) VALUES (?, ?, ?)', [context.id, prompt.id, sortOrder]);
}