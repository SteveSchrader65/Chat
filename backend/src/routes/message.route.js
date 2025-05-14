import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js"
import { getMessages, getUsers, sendMessage } from "../controllers/message.controller.js"

const router = express.Router()

router.get("/users", protectRoute, getUsers)
router.get("/:id", protectRoute, getMessages)
router.post("/send/:id", protectRoute, sendMessage)
router.get("/test-auth", protectRoute, (req, res) => {
  res.json({message: "Authenticated!", user: req.user})
})
export default router
