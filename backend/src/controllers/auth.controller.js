import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import cloudinary from "../lib/cloudinary.js"
import {generateToken} from "../lib/utils.js"

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user)
  } catch (error) {
    res.status(500).json({message: `Error in checkAuth controller: ${error}`})
  }
}

export const signup = async (req, res) => {
  const {userName, email, password} = req.body

  try {
    if (!userName || !email || !password) {
      return res.status(400).json({message: "All fields are required"})
    }

    if (password.length < 6) {
      return res.status(400).json({message: "Password must be at least 6 characters"})
    }

    const user = await User.findOne({email})

    if (user) return res.status(400).json({message: "Email already exists"})

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = new User({
      userName,
      email,
      password: hashedPassword,
    })

    if (newUser) {
      await newUser.save()
      generateToken(newUser._id, res)

      res.status(201).json({
        _id: newUser._id,
        userName: newUser.userName,
        email: newUser.email,
        profilePic: newUser.profilePic,
        createdAt: newUser.createdAt,
      })
    } else {
      res.status(400).json({message: "Invalid user data"})
    }
  } catch (error) {
    res.status(500).json({message: `Error in signup controller: ${error.message}`})
  }
}

export const login = async (req, res) => {
  const {email, password} = req.body

  try {
    const user = await User.findOne({email})

    if (!user) {
      return res.status(400).json({message: "Invalid credentials"})
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password)

    if (!isPasswordCorrect) {
      return res.status(400).json({message: "Invalid credentials"})
    }

    generateToken(user._id, res)

    res.status(200).json({
      _id: user._id,
      userName: user.userName,
      email: user.email,
      profilePic: user.profilePic,
    })
  } catch (error) {
    res.status(500).json({message: `Error in login controller: ${error.message}`})
  }
}

export const updateProfile = async (req, res) => {
  try {
    const {userName, profilePic, password} = req.body
    const userId = req.user._id
    const updateFields = {}

    if (profilePic) {
      try {
        const uploadResponse = await cloudinary.uploader.upload(profilePic)
        updateFields.profilePic = uploadResponse.secure_url
      } catch (error) {
        res.status(500).json({message: `Cloudinary upload error: ${error}`})
        return res
          .status(400)
          .json({message: "Image upload failed. File may be too large or invalid."})
      }
    }

    if (userName) updateFields.userName = userName

    if (password) {
      if (password.length < 6) {
        return res.status(400).json({message: "Password must be at least 6 characters"})
      }

      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)
      updateFields.password = hashedPassword
    }

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({message: "No update fields provided"})
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {$set: updateFields},
      {new: true}
    ).select("-password")

    if (!updatedUser) {
      return res.status(404).json({message: "User not found"})
    }

    res.status(200).json(updatedUser)
  } catch (error) {
    res.status(500).json({message: `Error in Profile update: ${error}`})
  }
}

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", {
      maxAge: 0,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    })
    res.status(200).json({message: "Logged out successfully"})
  } catch (error) {
    res.status(500).json({message: `Error in logout controller: ${error.message}`})
  }
}