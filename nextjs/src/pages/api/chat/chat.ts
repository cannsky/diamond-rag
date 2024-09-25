import { ChatJob } from '../db/interface/chatJob'
import { addChat, addChatJob } from '../db/system/add';
import sqlite3 from 'sqlite3';
import { Database } from 'sqlite';
import { initDb } from '../db/connect/init';
import { getChatJobs, getChat } from '../db/system/get';
import { Job } from '../job/job';
import { Server as SocketIOServer } from 'socket.io';

export class Chat {
    id: number;
    userId: number;
    db: Database<sqlite3.Database, sqlite3.Statement> | null;

    constructor(id: number, userId: number) {
        this.id = id ? id : 0;
        this.userId = userId;
        this.db = null;
    }

    async addNewChatJob(prompt: string, socketio: SocketIOServer) {
        // Open the database
        this.db = await initDb();
        // Get the chat id
        const chat = await getChat(this.db, this.id, this.userId);
        // Check if the chat id is invalid
        if (!chat) {
            // Add chat and get the chat id
            const result = await addChat(this.db, this.userId);
            // Check if the result is valid
            if (result) this.id = result;
            // Return if the result is invalid
            else return;
            // Emit the chat id to the client
            socketio?.emit('stream', { data: "[CHAT_ID]" + this.id + "[/CHAT_ID]" });
        }
        // Create a new job
        const job = new Job('gpt-4o-mini', prompt, socketio, this.db);
        // Handle the job
        await job.execute();
        // Add the job to the database
        await addChatJob(this.db, this.id, job.id);
    }

    async getChatHistory() : Promise<string | null> {
        // Open the database
        this.db = await initDb();
        // Get the chat jobs
        const chatJobs = await getChatJobs(this.db, this.id, this.userId);
        // Return the chat jobs in JSON format
        return JSON.stringify(chatJobs);
    }
}