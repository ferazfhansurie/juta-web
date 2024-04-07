// utils/webhookHandler.js
export async function handleNewMessages(req, res) {
    try {
        console.log('Handling new messages...');
        const receivedMessages = req.body.messages;

        // Your webhook handling logic goes here...

        res.send('All messages processed');
    } catch (e) {
        console.error('Error:', e.message);
        res.send(e.message);
    }
}

// Define other helper functions used in your webhook handling logic...
