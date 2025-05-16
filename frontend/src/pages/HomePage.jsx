import {useAuth} from "../hooks/useAuth"
import {useChat} from "../hooks/useChat"
import {useTheme} from "../hooks/useTheme"
import Sidebar from "../components/Sidebar"
import NoChat from "../components/NoChat"
import ChatContainer from "../components/ChatContainer"
import {OnlineUserNotifier} from "../components/OnlineNotifier"

const HomePage = () => {
  const {theme} = useTheme()
  const {selectedUser} = useChat()
  const {onlineUsers} = useAuth()

  return (
    <div data-theme={theme} className="min-h-screen bg-base-200">
      <OnlineUserNotifier onlineUsers={onlineUsers} />
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />
            {!selectedUser ? <NoChat /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
