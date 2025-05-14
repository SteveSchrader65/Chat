import {create} from "zustand"
import {io} from "socket.io-client"
import toast from "react-hot-toast"
import {axiosInstance} from "../lib/axios"
import {useAuth} from "./useAuth"

export const useChat = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  typingUser: null,
  socket: null,

  initSocket: () => {
    const authUser = useAuth.getState().authUser

    if (!authUser || get().socket) return

    const socket = io("http://localhost:5180", {
      query: {userId: authUser._id, userName: authUser.userName},
    })

    socket.on("typing", (payload) => {
      set({typingUser: payload.userName})
    })

    socket.on("stopTyping", () => {
      set({typingUser: null})
    })

    socket.on("newMessage", (newMessage) => {
      set({
        messages: [...get().messages, newMessage],
      })
    })

    set({socket})
  },

  getUsers: async () => {
    set({isUsersLoading: true})

    try {
      const res = await axiosInstance.get("/messages/users")

      set({users: res.data})
    } catch (error) {
      toast.error(error.response.data.message)
    } finally {
      set({isUsersLoading: false})
    }
  },

  getMessages: async (userId) => {
    set({isMessagesLoading: true})

    try {
      const res = await axiosInstance.get(`/messages/${userId}`)

      set({messages: res.data})
    } catch (error) {
      toast.error(error.response.data.message)
    } finally {
      set({isMessagesLoading: false})
    }
  },

  sendMessage: async (messageData) => {
    const {selectedUser, messages} = get()

    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData)

      set({messages: [...messages, res.data]})
    } catch (error) {
      toast.error(error.response.data.message)
    }
  },

  sendTyping: () => {
    const {socket} = get()
    const authUser = useAuth.getState().authUser

    if (socket && authUser) {
      socket.emit("typing", {userId: authUser._id, userName: authUser.userName})
    }
  },

  sendStopTyping: () => {
    const {socket} = get()
    const authUser = useAuth.getState().authUser

    if (socket && authUser) {
      socket.emit("stopTyping", {userId: authUser._id})
    }
  },

  subscribeToMessages: () => {
    const {selectedUser} = get()

    if (!selectedUser) return

    const socket = useAuth.getState().socket

    socket.on("newMessage", (newMessage) => {
      if (newMessage.senderId !== selectedUser._id) return

      set({
        messages: [...get().messages, newMessage],
      })
    })
  },

  unsubscribeFromMessages: () => {
    const socket = useAuth.getState().socket

    if (socket) {
      socket.off("newMessage")
      socket.off("typing")
      socket.off("stopTyping")
    }  },

  setSelectedUser: (selectedUser) => set({selectedUser}),
}))
