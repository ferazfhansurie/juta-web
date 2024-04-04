export default async function handler(req, res) {
    if (req.method === 'GET') {
      try {
        const BOTPRESS_API_URL = 'https://api.botpress.cloud/v1/chat/conversations';
        const BOTPRESS_ACCESS_TOKEN = process.env.BOTPRESS_ACCESS_TOKEN; // Use environment variable
        
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
    } else {
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }