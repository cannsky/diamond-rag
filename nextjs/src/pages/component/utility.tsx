import React from 'react';
import parse from 'html-react-parser';

export function formatText(text: string): React.ReactNode {
    let boldFormattedText = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    let listFormattedText = boldFormattedText.replace(/\* (.*?)(?=(\n|$|\*))/g, "<li>$1</li>");
    let imageFormattedText = listFormattedText.replace(/\[STREAM_DATA_IMG\](.*?)\[\/STREAM_DATA_IMG\]/g, '<img src="$1" alt="Generated Image" />');
    let titleFormattedText = imageFormattedText.replace(/###(.*?)\:/g, '<h3>$1</h3>');
    let titleNewLineFormattedText = titleFormattedText.replace(/<h3>/g, '<br><br><h3>').replace(/<\/h3>/g, '</h3><br>');
    //let listGroupFormattedText = listFormattedText.replace(/(<li>.*?<\/li>)+/g, "<ul>$&</ul>");
    return parse(titleNewLineFormattedText);
}

export function extractTagContent(data: string, tagName: string) {
    // Extract the chat id from the data
    const match = data.match(/\[CHAT_ID\](.*?)\[\/CHAT_ID\]/);
    // Return the chat id
    if (match && match[1]) return match[1];
    // If the chat id doesn't exist, return null
    else return null;
}