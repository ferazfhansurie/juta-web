const express = require('express');
const next = require('next');
const bodyParser = require('body-parser');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const admin = require('firebase-admin');
// Load environment variables from .env file in development
require('dotenv').config();
const cors = require('cors');

const port = parseInt(process.env.PORT, 10) || 9000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const serviceAccount = require('./firebase.json'); 
const firebaseConfig = {
    apiKey: "AIzaSyCc0oSHlqlX7fLeqqonODsOIC3XA8NI7hc",
    authDomain: "onboarding-a5fcb.firebaseapp.com",
    databaseURL: "https://onboarding-a5fcb-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "onboarding-a5fcb",
    storageBucket: "onboarding-a5fcb.appspot.com",
    messagingSenderId: "334607574757",
    appId: "1:334607574757:web:2603a69bf85f4a1e87960c",
    measurementId: "G-2C9J1RY67L"
  };
admin.initializeApp({
  firebaseConfig
  });
  const db = admin.firestore();
app.prepare().then(() => {
  const server = express();
  
  server.use(bodyParser.json());
  server.use(cors());
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
      const companyId = "010"; // This should be dynamically determined based on your application's needs
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
      const companyId = "010"; // This should be dynamically determined based on your application's needs
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
      // Make sure to replace 'companyId' with the actual ID you wish to query
      const companyId = "010"; // This should be dynamically determined based on your application's needs
      const snapshot = await db.collection('materials').get();
        
      
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json(data);

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

  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
