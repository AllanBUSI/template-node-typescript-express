require("dotenv").config();
import http from "http";
import * as socketio from "socket.io";

export default (server: http.Server) => {
  const io = new socketio.Server();
  io.listen(Number(process.env.SOCKET_PORT || 5001), {
    cors: {
      origin: process.env.SITE_URL,
      methods: ["GET"],
      credentials: true,
    },
  });
  console.log("SocketIO connecté");

  io.on("connection", socket => {});
};
