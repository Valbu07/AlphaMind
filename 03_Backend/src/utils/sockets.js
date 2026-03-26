const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const config = require("../config/config"); 

const connectedUsers = new Map();
let io;

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "http://52.21.74.39:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("Token requerido"));

    try {
      const decoded = jwt.verify(token, config.jwt.secret); 
      socket.userId = decoded.id_usuario;                   
      next();
    } catch (err) {
      next(new Error("Token inválido"));
    }
  });

  io.on("connection", (socket) => {
    connectedUsers.set(String(socket.userId), socket.id);
    console.log(` Usuario ${socket.userId} conectado — socket: ${socket.id}`);

    socket.on("disconnect", () => {
      connectedUsers.delete(String(socket.userId));
      console.log(`Usuario ${socket.userId} desconectado`);
    });
  });

  return io;
}

function notifyUser(userId, evento, data) {
  const socketId = connectedUsers.get(String(userId));
  if (socketId) {
    io.to(socketId).emit(evento, data);
    return true;
  }
  return false;
}

module.exports = { initSocket, notifyUser };