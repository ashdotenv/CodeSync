import express, { Application, Request, Response } from "express";
import http from "http";
import { Server } from "socket.io";
import { ACTIONS } from "./actions";

const app: Application = express();
const server = http.createServer(app);

const io: Server = new Server(server);

interface UserSocketMap {
  [socketId: string]: string;
}

app.get("/check-health", (req, res) => {
  res.status(200).json({
    message: "All good!"
  })
})

const userSocketMap: UserSocketMap = {};
function getAllConnectedClients(roomId: string) {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        name: userSocketMap[socketId],
      };
    }
  );
}

io.on("connection", (socket) => {

  socket.on(ACTIONS.JOIN, ({ roomId, name }) => {
    userSocketMap[socket.id] = name;
    socket.join(roomId);
    const clients = getAllConnectedClients(roomId);
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(ACTIONS.JOINED, {
        clients,
        name,
        socketId: socket.id,
      });
    });
  });

  socket.on(ACTIONS.CODE_CHANGE, ({ code, roomId }) => {
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  socket.on(ACTIONS.LANGUAGE_CHANGE, ({ language, roomId }) => { 
    socket.in(roomId).emit(ACTIONS.LANGUAGE_CHANGE, { language });
  });

  socket.on(ACTIONS.SYNC_CODE, ({ code, socketId }) => {
    if (code.length > 0) {
      io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
    }
  });

  socket.on(ACTIONS.SYNC_LANGUAGE, ({ language, socketId }) => {
    io.to(socketId).emit(ACTIONS.LANGUAGE_CHANGE, { language });
  });

  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      socket.to(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        name: userSocketMap[socket.id],
      });
    });
    delete userSocketMap[socket.id];
  });
});

export default server;
