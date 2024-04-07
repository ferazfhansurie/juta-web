// pages/api/sendMessage.js

export default async function handler(req, res) {
    if (req.method === 'POST') {
      try {
        const { to, body } = req.body;
  
        // Send the message using the provided parameters
        const response = await fetch('https://gate.whapi.cloud/messages/text', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.WHAPI_ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            to,
            body
          })
        });
  
        // Check if the request was successful
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to send message');
        }
  
        // Extract the response JSON and send it back
        const responseData = await response.json();
        res.status(201).json(responseData);
      } catch (error) {
        console.error('Error sending message:', error.message);
        res.status(500).json({ error: error.message || 'Failed to send message' });
      }
    } else {
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
  