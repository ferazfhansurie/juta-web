// pages/api/materials/index.js
import admin from '../../../firebase'; // adjust the import path as necessary

const db = admin.firestore();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const materialsSnapshot = await db.collection('materials').get();
      const materials = materialsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.status(200).json(materials);
    } catch (error) {
      console.error('Error fetching materials:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
