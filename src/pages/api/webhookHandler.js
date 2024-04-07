// pages/api/webhookHandler.js

import { handleNewMessages } from '../api/handleMessage'; // Assuming the webhook handling logic is in a separate file

export default async function handler(req, res) {
    if (req.method === 'POST') {
        await handleNewMessages(req, res);
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
