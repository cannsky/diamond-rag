import { NextApiRequest, NextApiResponse } from 'next';

export const checkHasSpecialCharacters = (str: string): boolean => {
    // Check special characters
    const specialCharacters = /[^a-zA-Z0-9 ]/;
    // Check if the str contains special characters
    const hasSpecialCharacters = specialCharacters.test(str);
    // Return hasSpecialCharacters
    return hasSpecialCharacters;
}

export const checkJsonObject = (req: NextApiRequest) => {
    // Check if the request body is JSON
    if (req.body && req.headers['content-type'] != 'application/json') return false;
    // Return null if the request body is JSON
    return true;
}

export const checkString = (str: any, optional: boolean = false): boolean => {
    // Check if not null or undefined
    if (!str) return false;
    // Check if a string
    if (typeof str !== 'string') return false;
    // Check if special characters exist
    if (checkHasSpecialCharacters(str)) return false;
    // Check if empty
    if (!optional && str === '') return false;
    // Return true
    return true;
}

export const checkNumber = (num: any, optional: boolean = false): boolean => {
    // Check if not null or undefined
    if (!num) return false;
    // Check if a number
    if (typeof num !== 'number') return false;
    // Return true
    return true;
}

export const checkDataValidity = (req: NextApiRequest, res: NextApiResponse) => {
    // Check if the request method is POST
    if (req.method != 'POST') return res.status(405).json({ error: 'Method not allowed' });
    // Check if the request body is JSON
    if (!checkJsonObject(req)) return res.status(400).json({ error: 'Invalid request' });
    // Return an error if the action is not a string, contains special characters or empty
    if (req.query.action != null && req.query.action != undefined && !checkString(req.query.action)) return res.status(400).json({ error: 'Invalid action' });
    // Return null
    return null;
}