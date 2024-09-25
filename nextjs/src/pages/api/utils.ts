import { sendRequestToApi } from './request';
import { Job } from './job/job';
import { getContextPredefinedPrompt } from './db/system/get';

export async function extractJson(jsonString: string) {
    // Extract the JSON from the response 
    const jsonMatch = jsonString.match(/\{[\s\S]*?\}/);
    // If there is JSON, parse it
    if (jsonMatch) {
        try {
            // Return the parsed JSON
            return JSON.parse(jsonMatch[0]);
        } catch (error) {
            // Log the error
            console.log(error);
            // Return null
            return null;
          }
    }
    else return null;
}

export async function findContext(job: Job) {
    // Check if the job has a database
    if (job.db === null) return;
    // Get the context of the job
    const predefinedPrompt = await getContextPredefinedPrompt(job.db, 2, 0);
    // If there is no context predefined prompt, return
    if(!predefinedPrompt) return;
    // Find the context prompt
    const findContextPrompt = predefinedPrompt.prefix + job.prompt + predefinedPrompt.suffix;
    // Send the request to the API
    const response = await sendRequestToApi(job.model, findContextPrompt);
    // Return the response
    return extractJson(response);
}