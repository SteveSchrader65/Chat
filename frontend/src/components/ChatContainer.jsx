import {useEffect, useRef} from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import {useChat} from "../hooks/useChat"
import {useAuth} from "../hooks/useAuth"
import {useFontsizer} from "../hooks/useFontsizer"
import ChatHeader from "./ChatHeader"
import MessageInput from "./MessageInput"
import MessageSkeleton from "./skeletons/MessageSkeleton"
import {formatMessageTime, formatMessageDate} from "../lib/utils"

const ChatContainer = () => {
  const {messages, getMessages, isMessagesLoading, selectedUser, subscribeToMessages, unsubscribeFromMessages} = useChat()
  const {authUser} = useAuth()
  const messageRef = useRef(null)
  const fontsize = useFontsizer((state) => state.fontSize)
  const typingUser = useChat((state) => state.typingUser)
  const initSocket = useChat((state) => state.initSocket)

  useEffect(() => {
    if (messageRef.current && messages) {
      messageRef.current.scrollIntoView({behavior: "smooth"})
    }
  }, [messages])

  useEffect(() => {
    getMessages(selectedUser._id)
    subscribeToMessages()

    return () => unsubscribeFromMessages()
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages])

  useEffect(() => {
    if (authUser) {
      initSocket(authUser)
    }
  }, [authUser, initSocket])

  const isNewday = (date1, date2) => {
    const d1 = new Date(date1)
    const d2 = new Date(date2)

    return (
      d1.getFullYear() !== d2.getFullYear() ||
      d1.getMonth() !== d2.getMonth() ||
      d1.getDate() !== d2.getDate()
    )
  }

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto" style={{fontSize: `${fontsize}px`}}>
      <ChatHeader />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => {
          const senderId = message.senderId?._id || message.senderId
          const isCurrentUser = senderId === authUser?._id
          const isLastMessage = index === messages.length - 1
          const prev = index > 0 ? messages[index - 1] : null
          const showSeparator = prev && isNewday(message.createdAt, prev.createdAt)

          return (
            <div key={message._id}>
              {showSeparator && (
                <div className="flex items-center my-6">
                  <hr className="flex-grow border-t border-gray-300" />
                  <span className="px-3 text-sm text-gray-500 bg-transparent">
                    {formatMessageDate(message.createdAt)}
                  </span>
                  <hr className="flex-grow border-t border-gray-300" />
                </div>
              )}
              <div
                className={`chat ${isCurrentUser ? "chat-end" : "chat-start"}`}
                ref={isLastMessage ? messageRef : null}>
                <div className=" chat-image avatar">
                  <div className="size-10 rounded-full border">
                    <img
                      src={
                        isCurrentUser
                          ? authUser.profilePic || "/avatar.png"
                          : selectedUser.profilePic || "/avatar.png"
                      }
                      alt="profile pic"
                    />
                  </div>
                </div>
                <div className="chat-header mb-1">
                  <time className="text-xs opacity-50 ml-1">
                    {formatMessageTime(message.createdAt)}
                    {!isCurrentUser && " " + selectedUser.userName}
                  </time>
                </div>
                <div className="chat-bubble flex flex-col">
                  {message.image && (
                    <img
                      src={message.image}
                      alt="Attachment"
                      className="sm:max-w-[200px] rounded-md mb-2"
                    />
                  )}
                  <div className="whitespace-pre-line">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        a: ({href, children, ...props}) => (
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline text-blue-500 hover:text-blue-600"
                            {...props}>
                            {children}
                          </a>
                        ),
                      }}>
                      {message.text}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
        <div ref={messageRef} />
      </div>
      {typingUser && (
        <div className="px-4 pb-2 text-xs text-zinc-400 animate-pulse">
          {typingUser} is typing ...
        </div>
      )}
      <MessageInput />
    </div>
  )
}

export default ChatContainer
