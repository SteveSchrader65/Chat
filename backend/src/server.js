import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"
import path from "path"
import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import { app, server } from "./lib/socket.js"
import { connectDB } from "./lib/db.js"

dotenv.config()

const PORT = process.env.PORT
const __dirname = path.resolve()
const allowedOrigins = [
  "http://localhost:5173",
  "https://chatterbox-08vk.onrender.com",
]

app.use(express.json())
app.use(cookieParser())

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error("Not allowed by CORS"))
      }
    },
    credentials: true,
  })
)

app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes)

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")))

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"))
  })
}

server.listen(PORT, () => {
  console.log("ChatServer is running on PORT:" + PORT)
  connectDB()
})
