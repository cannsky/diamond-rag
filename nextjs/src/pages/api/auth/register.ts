import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import { initDb } from '../db/connect/init';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

    const { username, password } = req.body;

    if (!username || !password) return res.status(400).json({ message: 'Username and password are required' });
    // Open the database
    const db = await initDb();
    try {
        // Begin a transaction
        await db.run('BEGIN TRANSACTION');
        // Check if the user already exists
        const existingUser = await db.get('SELECT * from users WHERE username = ?', [username]);
        // If the user already exists, rollback the transaction and return an error
        if (existingUser) {
            await db.run('ROLLBACK');
            return res.status(409).json({ message: 'Isername already taken' });
        }
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Insert the user into the database
        await db.run('INSERT INTO users (username, password, admin) VALUES (?, ?, 1)', [username, hashedPassword]);
        // Commit the transaction
        await db.run('COMMIT');
        // Return a success message
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        // Log the error
        console.error('Registration error:', error);
        // Rollback the transaction
        await db.run('ROLLBACK');
        // Return an error message
        res.status(500).json({ message: 'Internal Server Error' });
    }
}