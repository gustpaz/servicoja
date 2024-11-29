import WebSocket from 'ws';
import { Server } from 'http';
import jwt from 'jsonwebtoken';

let wss: WebSocket.Server;

export function initializeWebSockets(server: Server) {
  wss = new WebSocket.Server({ server });

  wss.on('connection', (ws: WebSocket) => {
    ws.on('message', (message: string) => {
      const data = JSON.parse(message);
      if (data.type === 'auth') {
        try {
          const decoded = jwt.verify(data.token, process.env.JWT_SECRET as string) as { userId: string };
          (ws as any).userId = decoded.userId;
        } catch (error) {
          ws.close();
        }
      }
    });
  });
}

export function sendNotification(userId: string, notification: any) {
  wss.clients.forEach((client) => {
    if ((client as any).userId === userId) {
      client.send(JSON.stringify(notification));
    }
  });
}

