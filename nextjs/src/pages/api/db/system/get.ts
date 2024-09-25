import sqlite3 from 'sqlite3';
import { Database } from 'sqlite';
import { checkString } from '../../data/utils/dataUtils';
import { ChatJob } from '../interface/chatJob';
import { ContextPredefinedPrompt } from '../interface/contextPredefinedPrompt';

export const getContextId = async (db: Database<sqlite3.Database, sqlite3.Statement>, contextName: string) => {
    // Check if the contextName is valid, not null, doesn't contain special characters
    if (!checkString(contextName)) return -1;
    // Get the contextId
    const context = await db.get('SELECT id FROM contexts WHERE name = ?', [contextName]);
    // If the context is invalid, do nothing
    if (!context) return 0;
    // Return the contextId
    return context.id;
}

export const getChat = async (db: Database<sqlite3.Database, sqlite3.Statement>, chatId: number, userId: number) => {
    // Check if the chat is valid
    const existingChat = await db.get('SELECT id FROM chats WHERE id = ? AND userId = ?', [chatId, userId]);
    // If the chat is invalid, do nothing
    if (!existingChat) return;
    // Return the chat
    return existingChat.id;
}

export const getChatJobs = async (db: Database<sqlite3.Database, sqlite3.Statement>, chatId: number, userId: number) : Promise<ChatJob[] | null> => {
    // Check if the chatId is valid
    const existingChat = await db.get('SELECT id FROM chats WHERE id = ? AND userId = ?', [chatId, userId]);
    // If the chatId is invalid, do nothing
    if (!existingChat) return null;
    // Get the chat jobs
    const chatJobs = await db.all('SELECT jobId FROM chatJobs WHERE chatId = ?', [chatId]);
    // Get prompts from each chat job
    const prompts = await Promise.all(
        chatJobs.map(async (chatJob) => {
            return await db.get('SELECT prompt FROM jobs WHERE id = ?', [chatJob.jobId]);
        })
    );
    // Get the contextOutputs from each chat job
    const contextOutputs = await Promise.all(
        chatJobs.map(async (chatJob) => {
            return await db.all('SELECT output FROM contextOutputs WHERE jobId = ?', [chatJob.jobId]);
        })
    );
    // Combine the prompts and contextOutputs
    const result: ChatJob[] = [];
    // Loop through the chat jobs
    for (let i = 0; i < chatJobs.length; i++) {
        result.push({
            prompt: prompts[i]?.prompt,
            contextOutputs: contextOutputs[i]?.map(output => output.output)
        });
    }
    // Return the prompts
    return result;
}

export const getModelName = async (db: Database<sqlite3.Database, sqlite3.Statement>, modelType: string) => {
    // Check if the modelType is valid, not null, doesn't contain special characters
    if (!checkString(modelType)) return;
    // Get the model Id
    const defaultModel = await db.get('SELECT modelId FROM defaultModels WHERE type = ?', [modelType]);
    // If the defaultModel is invalid, do nothing
    if (!defaultModel) return;
    // Get the model name
    const model = await db.get('SELECT name FROM models WHERE id = ?', [defaultModel.modelId]);
    // If the model is invalid, do nothing
    if (!model) return;
    // Return the model name
    return model.name;
}

export const getContextPredefinedPrompt = async (db: Database<sqlite3.Database, sqlite3.Statement>, contextId: number, sortOrder: number) : Promise<ContextPredefinedPrompt | null> => {
    // Check if the contextId and sortOrder are valid
    const existingContext = await db.get('SELECT id FROM contexts WHERE id = ?', [contextId]);
    // If the contextId is invalid, do nothing
    if (!existingContext) return null;
    // Get the contextPredefinedPrompt
    const contextPredefinedPrompt = await db.get(`SELECT predefinedPromptId, visibility FROM contextPredefinedPrompts WHERE contextId = ? AND sortOrder = ?`, [contextId, sortOrder]);
    // If the context predefined prompt is invalid, do nothing
    if (!contextPredefinedPrompt) return null;
    // Get the predefined prompt
    const existingPredefinedPrompt = await db.get('SELECT id, type, prefix, suffix FROM predefinedPrompts WHERE id = ?', [contextPredefinedPrompt.predefinedPromptId]);
    // If the contextPredefinedPromptId is invalid, do nothing
    if (!existingPredefinedPrompt) return null;
    // Get the context predefined prompt
    return {
        id: existingPredefinedPrompt.id, 
        type: existingPredefinedPrompt.type,
        prefix: existingPredefinedPrompt.prefix,
        suffix: existingPredefinedPrompt.suffix,
        visibility: contextPredefinedPrompt.visibility
    };
}

export const getContextPredefinedPromptCount = async (db: Database<sqlite3.Database, sqlite3.Statement>, contextId: number) => {
    // Check if the contextId is valid
    const existingContext = await db.get('SELECT id FROM contexts WHERE id = ?', [contextId]);
    // If the contextId is invalid, do nothing
    if (!existingContext) return 0;
    // Get the contextPredefinedPromptCount
    const contextPredefinedPrompts = await db.get('SELECT COUNT(*) FROM contextPredefinedPrompts WHERE contextId = ?', [contextId]);
    // Return the contextPredefinedPromptCount
    return contextPredefinedPrompts['COUNT(*)'];
}