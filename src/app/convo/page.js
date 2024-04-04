"use client";
import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import { Settings, HelpOutline, Translate, ArrowBack, Refresh as RefreshIcon, Chat as ChatIcon } from '@material-ui/icons'; // Import ChatIcon from Material UI
import {
  makeStyles,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@material-ui/core';
import Link from 'next/link';
// Formats timestamps into a readable format
const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
};
const handleSendMessage = async (newMessage, selectedChatId, setNewMessage, setMessages,userId) => {
  if (!newMessage.trim()) return;

  try {
    // Construct the message payload based on the message content
    const payload = {
      type: 'Text', // Assuming the message type is text
      text: newMessage // Assuming the message content is in the form of text
    };

    // Prepare the request body with the required properties
    const requestBody = {
      payload: payload,
      userId: userId, // Replace 'user_id_here' with the actual user ID
      conversationId: selectedChatId, // Assuming selectedChatId is the conversation ID
      tags: {} // You can include any tags if needed
    };

    // Send the message creation request to the server
    const response = await fetch("api/messages/text", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error("Failed to send message");
    }

    // Clear the input field
    setNewMessage('');

    // Fetch and update the messages for the selected chat (if needed)
    // You can handle this based on your application's logic
    // const res = await fetch(`/api/messages/${selectedChatId}`);
    // const data = await res.json();
    // setMessages(data.messages);
  } catch (error) {
    console.error("Error:", error.message);
    // Handle error (e.g., display error message to the user)
  }
};
const formatChatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const yesterday = new Date(now.setDate(now.getDate() - 1));

  if (date.toDateString() === now.toDateString()) {
    // If the message was sent today, return time
    return date.toLocaleTimeString([], { timeStyle: 'short' });
  } else if (date.toDateString() === yesterday.toDateString()) {
    // If the message was sent yesterday, return 'Yesterday' with time
    return `Yesterday ${date.toLocaleTimeString([], { timeStyle: 'short' })}`;
  } else {
    // If the message is older, return date with short month and day format
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }
};
// Renders different types of message content
const renderMessageContent = (message) => {
  // Assuming your payload structure for messages
  if (message.type === 'text') {
    return <span>{message.payload.text}</span>; // Adjust according to your payload
  } else if (message.type === 'image') {
    return <img src={message.payload.imageUrl} alt="Sent" style={{ maxWidth: '200px' }} />;
  } // Add more cases as needed
  return <span>Unsupported message type</span>;
};

export default function ChatPage() {
  const [chats, setChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const [userId, setUserId] = useState(null); // State variable to hold userId

useEffect(() => {
    // Fetch messages for the selected chat
    const fetchMessages = async () => {
      if (!selectedChatId) return;

      try {
        // Fetch the messages for the selected chat
        const res = await fetch(`/api/botpress/messages/${selectedChatId}`);
        if (!res.ok) {
          throw new Error(`Failed to fetch messages: ${res.status}`);
        }
        const data = await res.json();
        setMessages(data.messages); // Assuming the response has a 'messages' field

        // Extract the userId from the first message (assuming it's available)
        const userId = data.messages.length > 0 ? data.messages[0].userId : null;
        setUserId(userId); // Set the userId state variable
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
    };

    fetchMessages();
  }, [selectedChatId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch users
        const usersRes = await fetch('/api/botpress/users');
        if (!usersRes.ok) {
          throw new Error(`Failed to fetch users: ${usersRes.status}`);
        }
        const usersData = await usersRes.json();
        console.log('Fetched Users:', usersData.users);

        // Fetch chats
        const chatsRes = await fetch('/api/botpress/chats');
        if (!chatsRes.ok) {
          throw new Error(`Failed to fetch chats: ${chatsRes.status}`);
        }
        const chatsData = await chatsRes.json();

        // Match chats with users
        const users = Array.isArray(usersData.users) ? usersData.users : [];
        const matchedChats = chatsData.conversations.map((chat) => {
          const user = users.find((user) => user.tags['whatsapp:userId'] === chat.tags['whatsapp:userPhone']);
          return {
            ...chat,
            userName: user ? (user.name || chat.tags['whatsapp:userPhone']) :  chat.tags['whatsapp:userPhone'],
          };
        });

        setChats(matchedChats);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  return (
    <div className="chat-container">
      

      <div className="sidebar overflow-y-auto">
        <input
          type="text"
          placeholder="Search chats..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 my-2 mx-2 rounded-md border border-gray-300 w-full text-black"
        />
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`chat-list-item flex items-center justify-between px-4 py-3 ${selectedChatId === chat.id ? 'bg-gray-900' : 'hover:bg-gray-700'}`}
            onClick={() => setSelectedChatId(chat.id)}
          >
            <div className="flex items-center">
              <div className="flex flex-col">
                <span className="chat-name font-semibold">
                  {chat.userName || chat.tags['whatsapp:userPhone']}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex-1 flex flex-col">
           {/* Top bar displaying chat name or phone number */}
        {selectedChatId && (
        <div className="top-bar px-4 py-1 bg-gray-900 text-white flex items-center justify-between">
          <span className="font-semibold">
            {chats.find(chat => chat.id === selectedChatId)?.userName || selectedChatId.replace('@g.us', '')}
            
          </span>
          <div className="icon-container flex items-center"> {/* Container for icons */}
      {/* Refresh Button */}
      <IconButton color="inherit">
        <RefreshIcon />
      </IconButton>
      {/* Calendar Button */}
      <IconButton color="inherit">
        <Link href="/"> {/* This should be a valid route in your Next.js app */}
          <a>
            <ArrowBack /> {/* Use the ChatIcon component */}
          </a>
        </Link>
      </IconButton>
      {/* Chat Button */}


    </div>
     
        </div>
      )}
 {!selectedChatId && (
  <div className="top-bar px-4 py-1 bg-gray-900 text-white flex items-center justify-between">
    <span className="font-semibold">
      {"Select A Chat"}
    </span>
    <div className="icon-container flex items-center"> {/* Container for icons */}
      {/* Refresh Button */}
      <IconButton color="inherit">
        <RefreshIcon />
      </IconButton>
      {/* Calendar Button */}
      <IconButton color="inherit">
        <Link href="/"> {/* This should be a valid route in your Next.js app */}
          <a>
            <ArrowBack /> {/* Use the ChatIcon component */}
          </a>
        </Link>
      </IconButton>
      {/* Chat Button */}


    </div>
  </div>
)}
    
      <div className="chat-content overflow-y-auto flex-1 p-6">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.direction === 'in' ? 'message-in' : 'message-out'}`}>
            <div className="message-container">
              <span className="message-content">{renderMessageContent(message)}</span>
              <div className="text-xs text-gray-500 ml-2">{formatTimestamp(message.createdAt)}</div>
            </div>
          </div>
        )).reverse()}
        {/* Ensure the message input area is below the messages */}
        <div ref={messagesEndRef}></div>
      </div>
  {/* Message input area */}
  <div className="p-3 flex items-center bg-white border-t-2 border-gray-300">
        <input
          ref={inputRef}
          type="text"
          className="block w-full p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 mr-2"
          placeholder="Type a message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(newMessage, selectedChatId, setNewMessage, setMessages,userId)}
        />
        <button
          className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-md"
          onClick={() => handleSendMessage(newMessage, selectedChatId, setNewMessage, setMessages,userId)}
        >
          Send
        </button>
      </div>
    </div>
    </div>
  );
};

