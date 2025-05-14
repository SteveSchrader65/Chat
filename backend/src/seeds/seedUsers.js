import {config} from 'dotenv'
import {connectDB} from "../lib/db.js"
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"

config()

const seedUsers = [
  {
    email: "steve36lives@hotmail.com",
    userName: "Steve",
    password: "123456",
    profilePic: "https://res.cloudinary.com/dtgedknyb/image/upload/steve_mu30gw.png",
  },
  {
    email: "karencis@gmail.com",
    userName: "Karen",
    password: "123456",
    profilePic: "https://res.cloudinary.com/dtgedknyb/image/upload/speedy2_gkjgaa.png",
  },
]

const seedDatabase = async () => {
  try {
    await connectDB()

    const hashedUsers = await Promise.all(
      seedUsers.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10)
      }))
    )

    const users = await User.insertMany(hashedUsers)

    console.log("Database seeded successfully:", users)
  } catch (error) {
    console.error("Error seeding database:", error)
  } finally {
    process.exit(0)
  }
}

seedDatabase()