import { checkAdminSession } from '../utils/adminAuth';
import { checkDataValidity, checkString, checkNumber } from '../../utils/dataUtils';
import { NextApiRequest, NextApiResponse } from 'next';
import { addContext, addContextPredefinedPrompt } from '../../../db/admin/add';
import { initDb } from '../../../db/connect/init';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    // Data Safety

    // Check if the data is valid (POST request, JSON body, valid action)
    const dataValidityStatus = checkDataValidity(req, res);
    // Check if the data validity status is not null
    if (dataValidityStatus) return dataValidityStatus;

    // Database Connection

    // Initialize the database
    const db = await initDb();

    // Authorization

    // Check if an admin session exists
    const status = await checkAdminSession(db, req, res);
    // Check if the status is not null
    if (!status) return res.status(403).json({ error: 'Forbidden' });

    // Get action
    const { action } = req.query;

    // Check the action
    switch (action) {
        case 'add':
            // Check if the request body contains the required fields and they are valid with no special characters
            if (!checkString(req.body.name)) return res.status(400).json({ error: 'Invalid request' });
            // Get the checked fields
            const checkedName = req.body.name as string;
            // Add context to database
            await addContext(db, checkedName);
            // Return success message
            res.status(200).json({ success: 'Context is added'});
            break;
        case 'addContextPredefinedPrompt':
            // Check if the contextId, promptId, and sortOrder are valid
            if (!checkString(req.body.contextName) || 
                !checkString(req.body.predefinedPromptName)) return res.status(400).json({ error: 'Invalid request' });
            // Get the checked fields
            const checkedContextName = req.body.contextName as string;
            const checkedPredefinedPromptName = req.body.predefinedPromptName as string;
            const checkedSortOrder = req.body.sortOrder as number;
            // Add context prompt to database
            await addContextPredefinedPrompt(db, checkedContextName, checkedPredefinedPromptName, checkedSortOrder);
            // Return success message
            res.status(200).json({ success: 'Context predefined prompt is added'});
            break;
        default:
            res.status(404).json({ error: 'Invalid action' });
            break;
    }
}