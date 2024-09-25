import sqlite3 from 'sqlite3';
import { Database } from 'sqlite';
import { promises as fs } from 'fs';

async function readFileAsync(filePath: string): Promise<string> {
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        return data;
    } catch (error) {
        console.error('Error reading the file:', error);
        throw error;
    }
}

interface PredefinedPrompt {
    name: string;
    type: string;
    prefix: string;
    suffix: string;
    visible: boolean;
}

const addContext = async (db: Database<sqlite3.Database, sqlite3.Statement>, contextName: string, predefinedPrompts: PredefinedPrompt[]) => {
    // Add context
    const result = await db.run('INSERT INTO contexts (name) VALUES (?)', [contextName]);
    // Get context id
    const contextId = result.lastID;
    // Set index
    let index = 0;
    // Add predefined prompts
    for (const predefinedPrompt of predefinedPrompts) {
        // Add predefined prompt
        const predefinedPromptResult = await db.run('INSERT INTO predefinedPrompts (name, type, prefix, suffix) VALUES (?, ?, ?, ?)', 
            [predefinedPrompt.name, predefinedPrompt.type, predefinedPrompt.prefix, predefinedPrompt.suffix]);
        // Get predefined prompt id
        const predefinedPromptId = predefinedPromptResult.lastID;
        // Add contextPredefinedPrompt
        await db.run('INSERT INTO contextPredefinedPrompts (contextId, predefinedPromptId, sortOrder, visibility) VALUES (?, ?, ?, ?)', 
            [contextId, predefinedPromptId, index++, predefinedPrompt.visible]);
    }
}

export const addInitialContexts = async (db: Database<sqlite3.Database, sqlite3.Statement>) => {
    // Add default context
    await addContext(db, 'default', [
        { name: 'default', type: 'textGeneration', prefix: '', suffix: '', visible: true },
    ]);
    // Get findContext prefix
    const findContextPrefix = await readFileAsync('./initialData/findContextPrefix.txt');
    // Add findContext context
    await addContext(db, 'findContext', [
        { name: 'findContext', type: 'jsonGeneration', prefix: findContextPrefix, suffix: '', visible: false },
    ]);
    // Add itemGeneration context
    await addContext(db, 'itemGeneration', [
        { name: 'itemGeneration', type: 'textGeneration', prefix: 'Generate an item', suffix: '', visible: true },
    ]);
    // Add imageGeneration context
    await addContext(db, 'imageGeneration', [
        { name: 'imageGeneration', type: 'imageGeneration', prefix: findContextPrefix, suffix: '', visible: true },
    ]);
};