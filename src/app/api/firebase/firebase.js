const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

const db = admin.firestore();

router.get('/orders', async (req, res) => {
  try {
    const snapshot = await db.collection('orders').get();
    const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error fetching data from Firestore');
  }
});

router.get('/deliveries', async (req, res) => {
  try {
    const snapshot = await db.collection('deliveries').get();
    const deliveries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(deliveries);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error fetching data from Firestore');
  }
});

router.get('/materials', async (req, res) => {
  try {
    const snapshot = await db.collection('materials').get();
    const materials = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(materials);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error fetching data from Firestore');
  }
});

module.exports = router;
