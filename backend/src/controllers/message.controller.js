import User from "../models/user.model.js"
import Message from "../models/message.model.js"
import cloudinary from "../lib/cloudinary.js"
import {getReceiverSocketId, io} from "../lib/socket.js"

export const getUsers = async (req, res) => {
  try {
    const currentUserId = req.user._id
    const filteredUsers = await User.find({_id: {$ne: currentUserId}}).select("-password")

    res.status(200).json(filteredUsers)
  } catch (error) {
    res.status(500).json({error: `Error in getUsers: ${error.message}`})
  }
}

export const getMessages = async (req, res) => {
  try {
    const {id: otherId} = req.params
    const userId = req.user._id

    const messages = await Message.find({
      $or: [
        {senderId: userId, receiverId: otherId},
        {senderId: otherId, receiverId: userId},
      ],
    })

    res.status(200).json(messages)
  } catch (error) {
    res.status(500).json({error: `Error in getMessages controller: ${error.message}`})
  }
}

export const sendMessage = async (req, res) => {
  try {
    const {text, image} = req.body
    const {id: receiverId} = req.params
    const senderId = req.user._id
    let imageUrl

    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image)

      imageUrl = uploadResponse.secure_url
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    })

    await newMessage.save()

    const receiverSocketId = getReceiverSocketId(receiverId)

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage)
    }

    res.status(201).json(newMessage)
  } catch (error) {
    res.status(500).json({error: `Error in sendMessage controller: ${error.message}`})
  }
}
