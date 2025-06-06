import {Server} from "socket.io"
import http from "http"
import express from "express"

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://chatterbox-08vk.onrender.com",
    ],
    credentials: true,
  },
})

export function getReceiverSocketId(userId) {
  return userSocketMap[userId]
}

const userSocketMap = {}

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId

  if (userId) userSocketMap[userId] = socket.id
  console.log("A user disconnected", socket.id)

  io.emit("getOnlineUsers", Object.keys(userSocketMap))

  socket.on("typing", ({userId, userName}) => {
    socket.broadcast.emit("typing", {userId, userName})
  })

  socket.on("stopTyping", ({userId}) => {
    socket.broadcast.emit("stopTyping", {userId})
  })

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id)
    delete userSocketMap[userId]
    io.emit("getOnlineUsers", Object.keys(userSocketMap))
  })
})

export {io, app, server}
