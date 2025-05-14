import mongoose from "mongoose"
import Message from "../models/message.model.js"
import dotenv from "dotenv"

dotenv.config()

await mongoose.connect(process.env.MONGODB_URI)
await Message.deleteMany({})

console.log("All messages deleted!")
await mongoose.disconnect()
