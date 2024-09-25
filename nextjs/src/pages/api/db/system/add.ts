import sqlite3 from 'sqlite3';
import { Database } from 'sqlite';
import { checkString } from '../../data/utils/dataUtils';

export const addChat = async (db: Database<sqlite3.Database, sqlite3.Statement>, userId: number) => {
    // Check if user exists
    const existingUser = await db.get('SELECT id FROM users WHERE id = ?', [userId]);
    // If the user doesn't exist, do nothing
    if (!existingUser) return;
    // Add chat
    const result = await db.run('INSERT INTO chats (userId) VALUES (?)', [userId]);
    // Return the id of the chat
    return result.lastID;
}

export const addJob = async (db: Database<sqlite3.Database, sqlite3.Statement>, prompt: string, context: string, iteration: number) => {
    // Check if the prompt, and context are strings, not null, don't contain special characters
    if (!checkString(prompt) || !checkString(context)) return;
    // Add job
    const result = await db.run('INSERT INTO jobs (prompt, context, iterations) VALUES (?, ?, ?)', [prompt, context, iteration]);
    // Return the id of the job
    return result.lastID;
}

export const addChatJob = async (db: Database<sqlite3.Database, sqlite3.Statement>, chatId: number, jobId: number) => {
    // Get existing chat
    const existingChat = await db.get('SELECT id FROM chats WHERE id = ?', [chatId]);
    // Get existing job
    const existingJob = await db.get('SELECT id FROM jobs WHERE id = ?', [jobId]);
    // If the chatId or jobId is invalid, do nothing
    if (!existingChat || !existingJob) return;
    // If jobId is already connected to a chat, do nothing
    const existingChatJob = await db.get('SELECT * FROM chatJobs WHERE chatId = ? AND jobId = ?', [chatId, jobId]);
    // Return if the chat job already exists
    if (existingChatJob) return;
    // Add chat job
    return await db.run('INSERT INTO chatJobs (chatId, jobId) VALUES (?, ?)', [chatId, jobId]);
}

export const addContextInput = async (db: Database<sqlite3.Database, sqlite3.Statement>, jobId: number, sortOrder: number, predefinedPromptId: number, input: string) => {
    // Check if the input is a string, not null, doesn't contain special characters
    if (!checkString(input)) return;
    // Check if there is already an input with the same jobId and id
    const existingPrompt = await db.get('SELECT * FROM contextInputs WHERE jobId = ? AND sortOrder = ?', [jobId, sortOrder]);
    // If there is already an input with the same jobId and id, do nothing
    if (existingPrompt) return;
    // Add context input
    return await db.run('INSERT INTO contextInputs (jobId, sortOrder, predefinedPromptId, input) VALUES (?, ?, ?, ?)', [jobId, sortOrder, predefinedPromptId, input]);
}

export const addContextOutput = async (db: Database<sqlite3.Database, sqlite3.Statement>, jobId: number, sortOrder: number, predefinedPromptId: number, output: string) => {
    // Check if the output is a string, not null, doesn't contain special characters
    // if (!checkString(output)) return;
    // Check if there is already a output with the same jobId and id
    const existingPrompt = await db.get('SELECT * FROM contextOutputs WHERE jobId = ? AND sortOrder = ?', [jobId, sortOrder]);
    // If there is already an input with the same jobId and id, do nothing
    if (existingPrompt) return;
    // Add context output
    return await db.run('INSERT INTO contextOutputs (jobId, sortOrder, predefinedPromptId, output) VALUES (?, ?, ?, ?)', [jobId, sortOrder, predefinedPromptId, output]);
}