const express = require('express');
const next = require('next');
const bodyParser = require('body-parser');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const admin = require('firebase-admin');
// Load environment variables from .env file in development
require('dotenv').config();
const cors = require('cors');

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

const botpressRouter = require('./src/app/api/botpress/botpress.js');
const firebaseRouter = require('./src/app/api/firebase/firebase.js');
const chatRouter = require('/Users/firaz/Documents/Bots/tatapies/src/app/api/chatRoute.js');

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.use(bodyParser.json());
  server.use(cors());
  server.use('/api/botpress', botpressRouter);
  server.use('/api/firebase', firebaseRouter);
  server.use('/api', chatRouter);

  server.get('*', (req, res) => handle(req, res));

  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
