import {useRef, useState} from "react"
import {useChat} from "../hooks/useChat"
import {useDebounce} from "../hooks/useDebounce"
import {Image, Send, X} from "lucide-react"
import toast from "react-hot-toast"

const TYPING_TIMEOUT = 2000

const MessageInput = () => {
  const [text, setText] = useState("")
  const [imagePreview, setImagePreview] = useState(null)
  const fileInputRef = useRef(null)
  const {sendMessage} = useChat()
  const typingTimeoutRef = useRef(null)
  const sendTyping = useChat((state) => state.sendTyping)
  const sendStopTyping = useChat((state) => state.sendStopTyping)
  const MAX_FILE_SIZE = 100 * 1024

  const handleImageChange = (e) => {
    const file = e.target.files[0]

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file")
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("Max image size: 100kb")
      return
    }

    const reader = new FileReader()

    reader.onloadend = () => {
      setImagePreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleInputChange = (e) => {
    setText(e.target.value)
    sendTyping()

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)

    typingTimeoutRef.current = setTimeout(() => {
      sendStopTyping()
    }, TYPING_TIMEOUT)
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const submitMessage = async () => {
    if (!text.trim() && !imagePreview) return

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      })
    } catch (error) {
      console.error("Failed to send message:", error)
    }
  }

  const resetForm = () => {
    setText("")
    setImagePreview(null)

    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const {handleSubmit, isSubmitting} = useDebounce(submitMessage, resetForm)

  return (
    <div className="p-4 w-full">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button">
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <div className="mb-2 text-xs text-zinc-500">
        💡 To share code, wrap with triple backticks:
        <br />
        <span className="font-mono bg-zinc-100 px-1 py-0.5 rounded">
          ```
          <br />
          your code here
          <br />
          ```
        </span>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit()
        }}
        className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <textarea
            className="w-full input input-bordered rounded-lg input-sm sm:input-md resize-none"
            placeholder="Type a message..."
            value={text}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            rows={2}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />
          <button
            type="button"
            className={`hidden sm:flex btn btn-circle ${
              imagePreview ? "text-emerald-500" : "text-zinc-400"
            }`}
            onClick={() => fileInputRef.current?.click()}>
            <Image size={20} />
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={isSubmitting || (!text.trim() && !imagePreview)}>
          <Send size={22} />
        </button>
      </form>
    </div>
  )
}

export default MessageInput
