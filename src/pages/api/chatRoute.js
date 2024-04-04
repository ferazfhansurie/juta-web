const express = require('express');
const router = express.Router();

// Sample data storage (Replace with database operations in a real app)
let messages = [
    { id: 1, chatId: '1', userId: '1', text: 'Hello, world!', createdAt: new Date() },
    // Additional mock messages
];

router.get('/messages/:chatId', async (req, res) => {
    const { chatId } = req.params;
    const chatMessages = messages.filter(message => message.chatId === chatId);
    res.json(chatMessages);
});

router.post('/messages', async (req, res) => {
    const { userId, chatId, text } = req.body;
    const newMessage = {
        id: messages.length + 1,
        chatId,
        userId,
        text,
        createdAt: new Date()
    };
    messages.push(newMessage);
    res.status(201).json(newMessage);
});

module.exports = router;
