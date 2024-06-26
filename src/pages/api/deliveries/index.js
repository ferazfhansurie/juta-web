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
  } else if (req.method === 'POST') {
    try {
      const { cost, createdOn, dateDelivery, deliveryPerson, dropOffAddress, orderId, pickupLocation, recipientName, timeDelivery } = req.body;
      const newDeliveryRef = await db.collection('deliveries').add({
        cost,
        createdOn,
        dateDelivery,
        deliveryPerson,
        dropOffAddress,
        orderId,
        pickupLocation,
        recipientName,
        timeDelivery,
      });
      const newDelivery = await newDeliveryRef.get();
      res.status(201).json({ id: newDelivery.id, ...newDelivery.data() });
    } catch (error) {
      console.error('Error creating new delivery:', error);
      res.status(500).json({ error: 'Internal Server Error creating new delivery in Firestore' });
    }
  } else {
    // Restricting to GET and POST requests only
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
