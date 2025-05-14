import mongoose from "mongoose"
import User from "../models/user.model.js"
import dotenv from "dotenv"

dotenv.config()

await mongoose.connect(process.env.MONGODB_URI)
await User.deleteMany({})

console.log("All users deleted!")
await mongoose.disconnect()
