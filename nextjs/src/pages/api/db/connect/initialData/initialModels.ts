import sqlite3 from 'sqlite3';
import { Database } from 'sqlite';

const addModel = async (db: Database<sqlite3.Database, sqlite3.Statement>, modelName: string, modelType: string) => {
    // Add model
    const result = await db.run('INSERT INTO models (name, type) VALUES (?, ?)', [modelName, modelType]);
};

const addDefaultModel = async (db: Database<sqlite3.Database, sqlite3.Statement>, modelId: number, modelType: string) => {
    // Add default model
    const result = await db.run('INSERT INTO defaultModels (modelId, type) VALUES (?, ?)', [modelId, modelType]);
};

export const addInitialModels = async (db: Database<sqlite3.Database, sqlite3.Statement>) => {
    // Add gpt-4o-mini model
    await addModel(db, 'gpt-4o-mini', 'textGeneration');
    // Add dall-e-3 model
    await addModel(db, 'dall-e-3', 'imageGeneration');
    // Add gpt-4o-mini default model
    await addDefaultModel(db, 1, 'textGeneration');
    // Add dall-e-3 default model
    await addDefaultModel(db, 2, 'imageGeneration');
};