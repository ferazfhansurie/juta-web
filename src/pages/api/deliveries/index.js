// pages/api/deliveries/index.js
import admin from '../../../firebase'; // Adjust the import path to your Firebase Admin initialization module

const db = admin.firestore();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const snapshot = await db.collection('deliveries').get();
      const deliveries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.status(200).json(deliveries);
    } catch (error) {
      console.error('Error fetching deliveries data:', error);
      res.status(500).json({ error: 'Internal Server Error fetching data from Firestore' });
    }
  } else {
    // Restricting to GET requests only
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
