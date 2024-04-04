const express = require('express');
const router = express.Router();
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const BOTPRESS_API_URL = 'https://api.botpress.cloud/v1';
const BOTPRESS_ACCESS_TOKEN = 'bp_pat_IMGOjFXSvH3FxMOsiSvtsaozEKLj7BFtnYJj';
const BOT_ID = '3b10511b-15f8-4a33-ab6a-f1494e48b4bf';

router.get('/chats', async (req, res) => {
  try {
    const response = await fetch(`${BOTPRESS_API_URL}/chat/conversations`, {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${BOTPRESS_ACCESS_TOKEN}`,
        'x-bot-id': BOT_ID
      }
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/users', async (req, res) => {
  console.log("hello");
  try {
    const BOTPRESS_USERS_API_URL = 'https://api.botpress.cloud/v1/chat/users'; // Update with your actual endpoint
    const BOTPRESS_ACCESS_TOKEN = 'bp_pat_IMGOjFXSvH3FxMOsiSvtsaozEKLj7BFtnYJj';

    const response = await fetch(BOTPRESS_USERS_API_URL, {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${BOTPRESS_ACCESS_TOKEN}`,
        'x-bot-id': '3b10511b-15f8-4a33-ab6a-f1494e48b4bf'
      }
    });
    const users = await response.json();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/messages/:chatId', async (req, res) => {
  const { chatId } = req.params;
  try {
    const response = await fetch(`${BOTPRESS_API_URL}/chat/messages?conversationId=${chatId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${BOTPRESS_ACCESS_TOKEN}`,
        'x-bot-id': BOT_ID
      }
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
