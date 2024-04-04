// Note: File path should be pages/api/botpress/messages/[chatId].js
export default async function handler(req, res) {
    const { chatId } = req.query; // Access the dynamic route parameter
  
    if (req.method === 'GET') {
      try {
        const response = await fetch(`${process.env.BOTPRESS_API_URL}/chat/messages?conversationId=${chatId}`, {
          headers: {
            'Authorization': `Bearer ${process.env.BOTPRESS_ACCESS_TOKEN}`,
            'x-bot-id': process.env.BOT_ID
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
  