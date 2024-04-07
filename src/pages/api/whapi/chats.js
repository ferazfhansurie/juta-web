export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const response = await fetch('https://gate.whapi.cloud/chats', {
        headers: { 
          'Authorization': `Bearer ${process.env.WHAPI_ACCESS_TOKEN}`
        }
      });
      const data = await response.json();
  
      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}