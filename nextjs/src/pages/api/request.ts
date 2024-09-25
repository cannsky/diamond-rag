import { Job } from './job/job';
import OpenAI from 'openai';

const openai = new OpenAI();

export async function sendRequestToApi(model: string = 'gpt-4o-mini', prompt: string = '') {
    // Send request to API
    const completion = await openai.chat.completions.create({model: model, messages: [{ role: 'user', content: prompt}]});
    // Get the response
    let response = '';
    // If there is a response, set it
    if (completion.choices[0].message.content != undefined) response = completion.choices[0].message.content;
    // Return the response
    return response;
}

export async function sendStreamedRequestToApi(model: string = 'gpt-4o-mini', prompt: string = '', job: Job) {
    // Send streamed request to API    
    const stream = await openai.chat.completions.create({model: model, messages: [{ role: 'user', content: prompt}], stream: true});
    // Get the response
    let fullResponse = '';
    // Stream the response
    for await (const chunk of await stream) {
        // Get the content of the response
        const content = chunk.choices[0]?.delta?.content;
        // If there is content, add it to the full response
        if (content) {
            // Add the content to the full response
            fullResponse += content;
            // Emit the content to the client
            job.socketio?.emit('stream', { data: content });
        }
    }
    // Emit the end of the stream
    job.socketio?.emit('stream', { data: "END_OF_STREAM_DATA" });
    // Return the full response
    return fullResponse;
}

export async function sendImageRequestToApi(model: string = 'dall-e-3', prompt: string = '', job: Job) {
    // Send image generation request to API
    const response = await openai.images.generate({model: model, prompt: prompt});
    // Get the image URL
    let imageUrl = '';
    // If there is an image URL, set it
    if (response.data[0].url != undefined) imageUrl = response.data[0].url;
    // Emit the image URL to the client
    job.socketio?.emit('stream', { data: "[STREAM_DATA_IMG]" + response.data[0].url + "[/STREAM_DATA_IMG]" });
    // Emit the prompt to the client
    job.socketio?.emit('stream', { data: "[STREAM_DATA_IMG_PROMPT]" + prompt + "[/STREAM_DATA_IMG_PROMPT]" });
    // Emit the end of the stream
    job.socketio?.emit('stream', { data: "END_OF_STREAM_DATA" });
    // Return the image URL
    return imageUrl;
}