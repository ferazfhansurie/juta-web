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
// Helper function to format timestamp into a readable format
const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
};

// Helper function to format timestamp specifically for chat messages
const formatChatTimestamp = (timestamp) => {
  const date = new Date(timestamp * 1000);
  const now = new Date();
  const yesterday = new Date(now.setDate(now.getDate() - 1));

  // Check if the message was sent today
  if (date.toDateString() === new Date().toDateString()) {
    return date.toLocaleTimeString([], { timeStyle: 'short' });
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else {
    // If the message is older, return the date
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }
};

// Helper function to get the latest message text
const getLatestMessageText = (messages) => {
  // Assuming the latest message is at the end of the array
  const lastMessage = messages[messages.length - 1];
  // Check if last message and its text property exist before accessing body
  if (lastMessage && lastMessage.text && 'body' in lastMessage.text) {
    return lastMessage.text.body;
  }
  return 'No messages';
};

// Helper function to render different types of message content
const renderMessageContent = (message) => {
  switch (message.type) {
    case 'text':
      return <span>{message.text.body}</span>;
    case 'image':
      return (
        <div className="image-message max-w-xs"> {/* Adjust max width as needed */}
          <img 
            src={message.image.link} 
            alt="Sent image" 
            className="message-image w-full h-auto" // w-full makes the image responsive to the width of its container
          />
          {message.image.caption && (
            <div className="caption text-xs mt-1">{message.image.caption}</div> // text-xs makes the text smaller
          )}
        </div>
      );
    case 'document':
      return (
        <div className="document-message">
          <a href={message.document.link} target="_blank" rel="noopener noreferrer" className="message-document">
            {message.document.filename}
          </a>
        </div>
      );
    default:
      return <span>Unsupported message type</span>;
  }
};

export default function ChatPage() {
  const [chats, setChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Fetch chats
  useEffect(() => {
    const fetchChats = async () => {
      const res = await fetch('/api/whapi/chats');
      const data = await res.json();
      setChats(data.chats);
    };

    fetchChats();
  }, []);

  // Fetch messages for selected chat
// Fetch messages for selected chat
useEffect(() => {
  const fetchMessages = async () => {
    if (!selectedChatId) return;
    try {
      const res = await fetch(`/api/whapi/messages/${selectedChatId}`);
      const data = await res.json();
      setMessages(data.messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };
  fetchMessages();
}, [selectedChatId]);

// Scroll to bottom when messages change
useEffect(() => {
  if (messagesEndRef.current) {
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }
}, [messages]);

  const handleChatSelection = (chatId) => {
    setSelectedChatId(chatId);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChatId) return;
  
    try {
      // Send the message to the server using the API route
      const response = await fetch("/api/sendMessage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ to: selectedChatId, body: newMessage }) // Adjusted to pass 'to' and 'body'
      });
      console.log(response.json);
      if (!response.ok) {
        throw new Error("Failed to send message");
      }
  
      // Clear the input field
      setNewMessage('');
  
      // Fetch and update the messages for the selected chat
      const res = await fetch(`/api/whapi/messages/${selectedChatId}`);
      const data = await res.json();
      setMessages(data.messages);
    } catch (error) {
      console.error("Error:", error.message);
      // Handle error (e.g., display error message to the user)
    }
  };
  return (
    <div className="chat-container">
      <Head>
        <title>WhatsApp Clone</title>
      </Head>

      {/* Sidebar */}
      <div className="sidebar overflow-y-auto">
        {/* Search bar */}
        <input
          type="text"
          placeholder="Search chats..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 my-2 mx-2 rounded-md border border-gray-300 w-full text-black"
        />
        {/* Chat list */}
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`chat-list-item flex items-center justify-between px-4 py-3 ${selectedChatId === chat.id ? 'bg-gray-900' : 'hover:bg-gray-700'}`}
            onClick={() => handleChatSelection(chat.id)}
          >
            <div className="flex items-center">
              <div className="flex flex-col">
                <span className="chat-name font-semibold">
                  {chat.name || chat.id.replace('@g.us', '')}
                </span>
                <div className="chat-last-message text-sm text-gray-400" style={{ maxHeight: '3.0em', overflow: 'hidden', textOverflow: 'ellipsis', width: '150px' }}>
                  {chat.last_message?.text?.body || 'No messages'}
                </div>
              </div>
            </div>

            <div className="chat-time text-xs text-gray-400">
              {chat.last_message?.timestamp ? formatTimestamp(chat.last_message.timestamp) : ''}
            </div>
          </div>
        ))}
      </div>

      {/* Chat area and input area container */}
      <div className="flex-1 flex flex-col">
        {/* Top bar displaying chat name or phone number */}
        {selectedChatId && (
        <div className="top-bar px-4 py-1 bg-gray-900 text-white flex items-center justify-between">
          <span className="font-semibold">
            {chats.find(chat => chat.id === selectedChatId)?.name || selectedChatId.replace('@g.us', '')}
            
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
         
        {/* Chat Content */}
      {/* Chat Content */}
      
<div className="chat-content overflow-y-auto flex-1 p-6">
  {[...messages].reverse().map((message) => (
    <div key={message.id} className={`message ${message.from_me ? 'message-out' : 'message-in'}`}>
      {renderMessageContent(message)}
      <div className="text-xs text-gray-500 ml-2">
        {formatTimestamp(message.timestamp)}
      </div>
    </div>
  ))}
  <div ref={messagesEndRef} />
</div>
        {/* Message input area */}
        <div className="p-3 flex items-center bg-white border-t-2 border-gray-300">
          <input
            ref={inputRef}
            type="text"
            className="block w-full p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Type a message"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button
            className="ml-2 bg-green-500 hover:bg-green-600 text-white p-2 rounded-md"
            onClick={handleSendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}