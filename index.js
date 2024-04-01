const express = require('express');
const next = require('next');
const bodyParser = require('body-parser');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const admin = require('firebase-admin');
// Load environment variables from .env file in development
require('dotenv').config();

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const serviceAccount = require('./firebase.json'); 
const firebaseConfig = {
  apiKey: "AIzaSyDOijfOd2G2SnKcOejWPJt2qyzDYe8gYYM",
  authDomain: "tatapies.firebaseapp.com",
  projectId: "tatapies",
  storageBucket: "tatapies.appspot.com",
  messagingSenderId: "153923200089",
  appId: "1:153923200089:web:e394f993c09c8c20d9bd48",
  measurementId: "G-5BGBRYHGLQ"
};

admin.initializeApp({
  firebaseConfig
  });
  const db = admin.firestore();
app.prepare().then(() => {
  const server = express();
  
  server.use(bodyParser.json());

  // List Botpress Conversations
  server.get('/api/chats', async (req, res) => {
    try {
      const BOTPRESS_API_URL = 'https://api.botpress.cloud/v1/chat/conversations';
      const BOTPRESS_ACCESS_TOKEN = 'bp_pat_IMGOjFXSvH3FxMOsiSvtsaozEKLj7BFtnYJj';

      const response = await fetch(BOTPRESS_API_URL, {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${BOTPRESS_ACCESS_TOKEN}`,
          'x-bot-id': '3b10511b-15f8-4a33-ab6a-f1494e48b4bf'
        }
      });
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
  server.get('/api/users', async (req, res) => {
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
  // Fetch Messages for a Specific Conversation
  server.get('/api/messages/:chatId', async (req, res) => {
    const chatId = req.params.chatId;
    const BOTPRESS_API_URL = `https://api.botpress.cloud/v1/chat/messages?conversationId=${chatId}`;
    const BOTPRESS_ACCESS_TOKEN = 'bp_pat_IMGOjFXSvH3FxMOsiSvtsaozEKLj7BFtnYJj';

    try {
      const response = await fetch(BOTPRESS_API_URL, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${BOTPRESS_ACCESS_TOKEN}`,
          'x-bot-id': '3b10511b-15f8-4a33-ab6a-f1494e48b4bf'
        }
      });
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
  server.get('/api/firebase/orders', async (req, res) => {
    try {
      // Make sure to replace 'companyId' with the actual ID you wish to query
      const snapshot = await db.collection('orders').get();
        
      
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json(data);
  console.log(data);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error fetching data from Firestore');
    }
});
server.get('/api/firebase/deliveries', async (req, res) => {
    try {
      // Make sure to replace 'companyId' with the actual ID you wish to query

      const snapshot = await db.collection('deliveries').get();
        
      
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json(data);
  console.log(data);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error fetching data from Firestore');
    }
});
server.get('/api/firebase/materials', async (req, res) => {
    try {

      const snapshot = await db.collection('materials').get();
        
      
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json(data);
console.log(data);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error fetching data from Firestore');
    }
});
  // Send a New Message

  // Server-side code: message creation endpoint
  server.post('/api/messages/text', async (req, res) => {
    const { conversationId, payload, userId } = req.body;
    const BOTPRESS_API_URL = 'https://api.botpress.cloud/v1/chat/messages';
    const BOTPRESS_ACCESS_TOKEN = 'bp_pat_IMGOjFXSvH3FxMOsiSvtsaozEKLj7BFtnYJj';

    try {
      const response = await fetch(BOTPRESS_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${BOTPRESS_ACCESS_TOKEN}`,
          'x-bot-id': '3b10511b-15f8-4a33-ab6a-f1494e48b4bf',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: userId,
          conversationId: conversationId,
          payload: payload,
          type: 'text', // Assuming the type is always 'text'
          tags: {} // Assuming no tags are required
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to send message: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(data);
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });

  // Next.js default handler for all other GET requests
  server.get('*', (req, res) => handle(req, res));
  server.get('/', function (req, res) {
    res.send('Bot is running');
});
const port = process.env.PORT;
  server.listen(port, function () {
    console.log(`Listening on port ${port}...`);
});
});
