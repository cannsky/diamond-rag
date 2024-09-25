import { Server as SocketIOServer } from 'socket.io';
import { findContext } from '../utils';
import sqlite3 from 'sqlite3';
import { Database } from 'sqlite';
import { addJob } from '../db/system/add';
import { handleContext } from '../context';
import { ContextInput } from './interface/contextInput';
import { ContextOutput } from './interface/contextOutput';
import { getContextId, getContextPredefinedPromptCount } from '../db/system/get';
import { ContextPredefinedPrompt } from '../db/interface/contextPredefinedPrompt';

export class Job {
  id: number;
  model: string;
  prompt: string;
  output: string;
  context: string;
  contextId: number;
  contextPredefinedPrompt: ContextPredefinedPrompt;
  contextPredefinedPromptIndex: number;
  maxContextPredefinedPromptIndex: number;
  contextInputs: ContextInput[];
  contextOutputs: ContextOutput[];
  iterations: number;
  socketio: SocketIOServer;
  db: Database<sqlite3.Database, sqlite3.Statement> | null;

  constructor(model: string, prompt: string, socketio: SocketIOServer, db: Database<sqlite3.Database, sqlite3.Statement>) {
    this.id = 0;
    this.model = model;
    this.prompt = prompt;
    this.output = '';
    this.context = '';
    this.contextId = 0;
    this.contextPredefinedPrompt = { id: 0, type: '', prefix: '', suffix: '', visibility: false };
    this.contextPredefinedPromptIndex = 0;
    this.maxContextPredefinedPromptIndex = 0;
    this.iterations = 1;
    this.socketio = socketio;
    this.contextInputs = [];
    this.contextOutputs = [];
    this.db = db;
  }

  async execute() {
    // Check if the database is valid
    if (!this.db) return;
    // Find the context of the job
    const { context, userPrompt, iterationCount, saveMemory } = await findContext(this);
    // Set the context
    this.context = context;
    // Get the context id
    this.contextId = await getContextId(this.db, context);
    // Check if the context id is valid
    if (this.contextId < 0) return;
    // Get the max context predefined prompt index
    this.maxContextPredefinedPromptIndex = await getContextPredefinedPromptCount(this.db, this.contextId);
    // Check if max context predefined prompt index is valid
    if (this.maxContextPredefinedPromptIndex < 0) return;
    // Set the number of iterations
    this.iterations = iterationCount > 1 ? iterationCount : 1;
    // Add the job to the database and get the job id
    const jobId = await addJob(this.db, this.prompt, this.context, this.iterations);
    // Job id is invalid, return
    if (!jobId) return;
    // Set the job id
    this.id = jobId;
    // Handle the context for the number of iterations
    await handleContext(userPrompt, this);
  }
}