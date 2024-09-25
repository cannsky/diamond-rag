import { checkDataValidity, checkString, checkNumber } from '../../../utils/dataUtils';
import { NextApiRequest, NextApiResponse } from 'next';
import { initDb } from '../../../../db/connect/init';
import { checkUserSession } from '../../utils/userAuth';
import { getChatMessages } from '../../../../db/user/get';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Data Safety

    // Check if the data is valid (POST request, JSON body, valid action)
    const dataValidityStatus = checkDataValidity(req, res);
    // Check if the data validity status is not null
    if (dataValidityStatus) return dataValidityStatus;

    // Database Connection

    // Initialize the database
    const db = await initDb();

    // Get chatId
    const { chatId } = req.query;

    // Check user session and get the user id
    const userId = await checkUserSession(db, req, res);
    // Check if the user id is invalid
    if (userId == -1) return res.status(401).json({ error: 'Invalid user' });
    // Check if the chat id is invalid
    if(!checkNumber(Number(chatId))) return res.status(400).json({ error: 'Invalid request' });
    // Get the checked chat id
    const checkedChatId = Number(chatId);

    // Get Chat Messages
    const messages = await getChatMessages(db, checkedChatId, userId);
    // Check if the messages are invalid
    if (!messages) return res.status(400).json({ error: 'Invalid chat' });
    // Return the messages in JSON format
    return res.status(200).json(messages);
}