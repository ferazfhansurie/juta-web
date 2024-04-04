// pages/api/orders/index.js
import admin from '/Users/firaz/Documents/Bots/tatapies/src/firebase.js'; // Adjust the path based on where you placed the firebaseAdmin.js file
// Ensure you initialize Firebase Admin somewhere appropriate,
// such as in a separate utility file or directly within this file if not already initialized

const db = admin.firestore();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const snapshot = await db.collection('orders').get();
      const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.status(200).json(orders);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error fetching data from Firestore');
    }
  } else {
    // Handle any non-GET requests
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
