import sqlite3 from 'sqlite3';
import { Database } from 'sqlite';
import { ChatMessage } from '../interface/chatMessage';

export const getAppName = async (db: Database<sqlite3.Database, sqlite3.Statement>) => {
    // Get the app name
    const result = await db.get('SELECT appName FROM data WHERE id = 1');
    // Return the app name
    return result?.appName ?? 0;
};

export const getChatMessages = async (db: Database<sqlite3.Database, sqlite3.Statement>, chatId: number, userId: number) : Promise <ChatMessage[] | null>=> {
    // Get the chat
    const chat = await db.get('SELECT * FROM chats WHERE id = ? AND userId = ?', [chatId, userId]);
    // Check if chat is invalid
    if (!chat) return null;
    // Get chat jobs
    const chatJobs = await db.all('SELECT jobId FROM chatJobs WHERE chatId = ?', [chatId]);
    // Check if chat jobs are invalid
    if (!chatJobs) return null;
    // Chat messages
    const chatMessages : ChatMessage[] = [];
    // Loop through the chat jobs
    for (const chatJob of chatJobs) {
        // Get the job
        const job = await db.get('SELECT prompt, output FROM jobs WHERE id = ?', [chatJob.jobId]);
        // If the job is valid add it to the chat messages
        if (job) chatMessages.push({input: job.prompt, response: job.output});
    }
    // Return the chat messages
    return chatMessages;
}