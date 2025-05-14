import {useState, useEffect} from "react"
import {useChat} from "../hooks/useChat"
import {useAuth} from "../hooks/useAuth"
import SidebarSkeleton from "./skeletons/SidebarSkeleton"
import {Users} from "lucide-react"

const Sidebar = () => {
  const {getUsers, users, selectedUser, setSelectedUser, isUsersLoading} = useChat()
  const {onlineUsers} = useAuth()
  const [showOnlineOnly, setShowOnlineOnly] = useState(false)

  useEffect(() => {
    getUsers()
  }, [getUsers])

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users

  if (isUsersLoading) return <SidebarSkeleton />

  return (
    <aside className="h-full w-20 lg:w-60 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>

        {/* Online filter toggle */}
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">({onlineUsers.length - 1} online)</span>
        </div>
      </div>
      <div className="overflow-y-auto w-full py-3">
        {filteredUsers.map((user) => (
          <div key={user._id} className="relative group">
            <button
              onClick={() => setSelectedUser(user)}
              className={`
                w-full p-3 flex items-center gap-3
                hover:bg-base-300 transition-colors
                ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
              `}>
              <div className="relative mx-auto lg:mx-0">
                <img
                  src={user.profilePic || "/avatar.png"}
                  alt={user.name}
                  className="size-10 object-cover rounded-full"
                />
                {onlineUsers.includes(user._id) && (
                  <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
                )}
              </div>

              {/* User info - only visible on larger screens */}
              <div className="hidden lg:block text-left min-w-0">
                <div className="font-medium truncate">{user.userName}</div>
                <div className="text-sm text-zinc-400">
                  {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                </div>
              </div>
            </button>

            {/* Email tooltip */}
            <div className="absolute left-1/2 transform -translate-x-1/2 top-1 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-10">
              <div className="bg-base-200 text-sm py-1 px-2.5 rounded shadow-lg border border-base-300 whitespace-nowrap mt-1 before:content-[''] before:absolute before:top-0 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-45 before:bg-base-200 before:border-t before:border-l before:border-base-300 before:size-2">
                {user.email}
              </div>
            </div>
          </div>
        ))}
        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No online users</div>
        )}
      </div>
    </aside>
  )
}

export default Sidebar