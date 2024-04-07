export async function handleNewMessages(req, res) {
    try {
        console.log('Handling new messages...');
        const receivedMessages = req.body.messages;

        for (const message of receivedMessages) {
            if (message.from_me) break;
            if (!message.chat_id.includes("whatsapp")) {
                break;
            }
            const sender = {
                to: message.chat_id,
                name: message.from_name
            };

            if (message.type === 'text') {
                console.log('Received text message:', message);

                // Call the webhook before sending the response to the user
                const webhookResponse2 = await callWebhook('https://hook.us1.make.com/ip9bkgkfweqnpkyv1akwkqtgi065y4hp', message.text.body, sender.to, sender.name);

                if (webhookResponse2 === 'stop' || webhookResponse2 === 'Accepted') {
                    break;
                }
                if (webhookResponse2) {
                    // Send the response from the webhook to the user
                    await sendWhapiRequest('messages/text', { to: sender.to, body: webhookResponse2 });
                } else {
                    console.error('No valid response from webhook.');
                }

                console.log('Response sent.');
            } else if (message.type === 'image') {
                // Call the webhook before sending the response to the user
                const webhookResponse = await callWebhook("https://hook.us1.make.com/8i6ikx22ov6gkl5hvjtssz22uw9vu1dq", message.image.link, sender.to, sender.name);
                if (webhookResponse) {
                    // Send the response from the webhook to the user
                    await sendWhapiRequest('messages/text', { to: sender.to, body: webhookResponse });
                } else {
                    console.error('No valid response from webhook.');
                }

                console.log('Response sent.');
            } else {
                // Handle non-text messages here
            }
        }

        res.send('All messages processed');
    } catch (e) {
        console.error('Error:', e.message);
        res.send(e.message);
    }
}

export async function callWebhook(webhook, senderText, senderNumber, senderName) {
    console.log('Calling webhook...');
    const webhookUrl = webhook;
    const body = JSON.stringify({ senderText, senderNumber, senderName }); // Include sender's text in the request body
    const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: body
    });  
    let responseData = "";
    if (response.status === 200) {
        responseData = await response.text(); // Get response as text
    } else {
        responseData = 'stop';
    }
    console.log('Webhook response:', responseData); // Log raw response
    return responseData;
}

export async function sendWhapiRequest(endpoint, params = {}, method = 'POST') {
    console.log('Sending request to Whapi.Cloud...');
    const options = {
        method: method,
        headers: {
            Authorization: `Bearer ${config.token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
    };
    const url = `${config.apiUrl}/${endpoint}`;
    const response = await fetch(url, options);
    const jsonResponse = await response.json();
    console.log('Whapi response:', JSON.stringify(jsonResponse, null, 2));
    return jsonResponse;
}
