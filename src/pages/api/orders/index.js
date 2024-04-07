import admin from '../../../firebase.js';

const db = admin.firestore();

// Example pie prices
const piePrices = {
  "Classic Apple Pie": { "Regular 5+” (4-5 servings)": 100, "Medium 7+” (7-9 servings)": 78, "Large 9+” (12-14 servings)": 108 },
  "Johnny Blueberry": { "Regular 5+” (4-5 servings)": 120, "Medium 7+” (7-9 servings)": 110, "Large 9+” (12-14 servings)": 130 },
  "Lady Pineapple": { "Regular 5+” (4-5 servings)": 90, "Medium 7+” (7-9 servings)": 88, "Large 9+” (12-14 servings)": 105 },
  "Caramel 'O' Pecan": { "Regular 5+” (4-5 servings)": 110, "Medium 7+” (7-9 servings)": 110, "Large 9+” (12-14 servings)": 120 },
};

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
  } else if (req.method === 'POST') {
    try {
      const { name, pie, size, date, type, remarks, quantity } = req.body;

      // Parse quantity as a number and calculate the total
      const quantityNum = parseInt(quantity, 10);
      const pricePerUnit = piePrices[pie][size];
      const total = pricePerUnit * quantityNum;

      const docRef = await db.collection('orders').add({
        name, pie, size, date, type, remarks, 
        quantity: quantityNum, // Ensure quantity is stored as a number
        total // Store the calculated total
      });

      res.status(200).json({ id: docRef.id });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error adding new order to Firestore');
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.query; // Assuming the order ID is passed as a query parameter
      await db.collection('orders').doc(id).delete();
      res.status(200).json({ id, message: 'Order deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error deleting order from Firestore');
    }
  }else if (req.method === 'PATCH') {
    try {
      const { id } = req.query; // Assuming the order ID is passed as a query parameter
      const updates = req.body; // The updated order data
  
      await db.collection('orders').doc(id).update(updates);
      res.status(200).json({ id, message: 'Order updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error updating order in Firestore');
    }
  }else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
