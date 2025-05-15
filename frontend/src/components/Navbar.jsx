import {Link} from "react-router-dom"
import {useAuth} from "../hooks/useAuth"
import {LogOut, MessageSquare, Settings, User} from "lucide-react"
import Clock from "../components/Clock.jsx"

const Navbar = () => {
  const {logout, authUser} = useAuth()

  return (
    <header className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80">
      <div className="container mx-auto h-16">
        <div className="flex items-center h-full">
          <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
            <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-lg font-bold">ChatterBox</h1>
          </Link>
          <div className="ml-32">
            <Clock timeZone="Australia/Perth" label="Perth" />
          </div>
          {authUser && (
            <div className="flex items-center ml-20">
              <Link to={"/settings"} className="btn btn-sm gap-2">
                <Settings className="size-5" />
                <span className="hidden sm:inline">Settings</span>
              </Link>
              <Link to={"/profile"} className="btn btn-sm gap-2 ml-4">
                <User className="size-5" />
                <span className="hidden sm:inline">Profile</span>
              </Link>
              <div className="ml-20">
                <Clock timeZone="America/Santiago" label="Santiago" />
              </div>
            </div>
          )}
          <div className="flex-grow" />
          {authUser && (
            <button className="btn btn-sm gap-2" onClick={logout}>
              <LogOut className="size-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
