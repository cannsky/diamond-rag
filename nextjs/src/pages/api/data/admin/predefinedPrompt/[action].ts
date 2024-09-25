import { checkAdminSession } from '../utils/adminAuth';
import { checkDataValidity, checkString } from '../../utils/dataUtils';
import { NextApiRequest, NextApiResponse } from 'next';
import { addPredefinedPrompt } from '../../../db/admin/add';
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
            if (!checkString(req.body.name) ||
                !checkString(req.body.type) ||
                !checkString(req.body.prefix, true) ||
                !checkString(req.body.suffix, true)) return res.status(400).json({ error: 'Invalid request' });
            // Get the checked fields
            const checkedName = req.body.name as string;
            const checkedType = req.body.type as string;
            const checkedPrefix = req.body.prefix as string;
            const checkedSuffix = req.body.suffix as string;
            // Add prompt to database
            await addPredefinedPrompt(db, checkedName, checkedType, checkedPrefix, checkedSuffix);
            // Return success message
            res.status(200).json({ success: 'Predefined prompt is added'});
            break;
        default:
            res.status(404).json({ error: 'Invalid action' });
            break;
    }
}