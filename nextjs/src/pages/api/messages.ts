import { NextApiRequest, NextApiResponse } from 'next';
import { Server as SocketIOServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import { Chat } from './chat/chat';

type NextApiResponseWithSocket = NextApiResponse & {
  socket: {
    server: HttpServer & {
      io: SocketIOServer;
    };
  };
};

const SocketHandler = async (req: NextApiRequest, res: NextApiResponseWithSocket) => {
  if (!res.socket.server.io) {
    console.log('New Socket.io server...');
    const io = new SocketIOServer(res.socket.server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });
    res.socket.server.io = io;

    io.on('connection', (socket) => {
      console.log('Client connected');

      socket.on('disconnect', () => {
        console.log('Client disconnected');
      });
    });
  }

  const { chatId, message } = req.body;

  if (message) {
    // Get existing chat or create a new one if it doesn't exist
    const chat = new Chat(chatId, 1);
    // Add a new chat job and get the chatId
    await chat.addNewChatJob(message, res.socket.server.io);
    // Return the chat history
    res.status(200).json({ success: true, message: 'Message received' });
  } else {
    res.status(400).json({ success: false, message: 'Message not received' });
  }
};

export default SocketHandler;