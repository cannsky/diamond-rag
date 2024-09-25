import { Job } from './job/job';
import { sendStreamedRequestToApi, sendImageRequestToApi } from './request';
import { addContextInput, addContextOutput } from './db/system/add';
import { checkString } from './data/utils/dataUtils';
import { getContextPredefinedPrompt, getModelName } from './db/system/get';
import { updateJobOutput } from './db/system/update';
import { ContextInput } from './job/interface/contextInput';
import { ContextOutput } from './job/interface/contextOutput';

const generateInput = async (job: Job, prompt: string): Promise<{contextInput: string, contextPredefinedPromptType: string} | null> => {
    // Check if the user prompt is valid
    if (!checkString(prompt)) return null;
    // Check if the job has a database
    if (!job.db) return null;
    // Get context predefined prompt
    const contextPredefinedPrompt = await getContextPredefinedPrompt(job.db, job.contextId, job.contextPredefinedPromptIndex);
    // If there is no context predefined prompt, return null
    if (!contextPredefinedPrompt) return null;
    // Generate context prompt
    const contextInput = `${contextPredefinedPrompt.prefix} ${prompt} ${contextPredefinedPrompt.suffix}`;
    // Add context input to the database
    await addContextInput(job.db, job.id, job.contextPredefinedPromptIndex, contextPredefinedPrompt.id, contextInput);
    // Add context input to the job
    job.contextInputs.push(ContextInput.create(job.id, contextInput, contextPredefinedPrompt.id));
    // Add context predefined prompt to the job
    job.contextPredefinedPrompt = contextPredefinedPrompt;
    // Return the context input and the context predefined prompt type
    return {contextInput: contextInput, contextPredefinedPromptType: contextPredefinedPrompt.type};
}

const generateOutput = async (job: Job, output: string) => {
    // Check if the output is valid
    // if (!checkString(output)) return;
    // Check if the job has a database
    if (!job.db) return;
    // Add context output to the database
    await addContextOutput(job.db, job.id, job.contextPredefinedPromptIndex, job.contextInputs[job.contextPredefinedPromptIndex].contextPredefinedPromptId, output);
    // Add context output to the job
    job.contextOutputs.push(ContextOutput.create(job.id, output, job.contextInputs[job.contextPredefinedPromptIndex].contextPredefinedPromptId, job.contextPredefinedPrompt.visibility));
}

export const handleRequestType = async (type: string, contextInput: string, job: Job): Promise<string | null | undefined> => {
    try {
        // Check if the job has a database
        if (!job.db) return null;
        // Get model name
        const modelName = await getModelName(job.db, type);
        // If there is no model name, return
        if (!modelName) return null;
        // Handle request type
        const actions: { [key: string]: () => Promise<string> } = {
            itemGeneration: async () => await sendStreamedRequestToApi(modelName, contextInput, job),
            imageGeneration: async () => await sendImageRequestToApi(modelName, contextInput, job),
            default: async () => await sendStreamedRequestToApi(modelName, contextInput, job),
            memory: async () => 'Memory',
        };
        // If there is an action, execute it
        const response = await (actions[type] || actions['default'])();
        // Generate output
        return response;
    }
    catch (error) { console.log(error); }
}

export const handleContext = async (userPrompt: string, job: Job) => {
    try {
        // Check if the job has a database
        if (!job.db) return;
        // Iterate through the context predefined prompts
        for(let i = 0; i < job.maxContextPredefinedPromptIndex; i++) {
            // Generate context prompt
            const context = await generateInput(job, userPrompt);
            // If there is no context prompt, return
            if (!context) return;
            // Send streamed request to API
            const response = await handleRequestType(context.contextPredefinedPromptType, context.contextInput, job);
            // If there is no response, return
            if (!response && typeof response !== 'string') return;
            // Generate output
            await generateOutput(job, response);
            // Set job output if the context predefined prompt index is the max context predefined prompt index
            if (++job.contextPredefinedPromptIndex >= job.maxContextPredefinedPromptIndex) updateJobOutput(job.db, job.id, response);
        }
    }
    catch (error) { console.log(error); }
}