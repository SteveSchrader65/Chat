import {useState} from "react"
import {Link} from "react-router-dom"
import {useAuth} from "../hooks/useAuth"
import {LogOut, MessageSquare, Settings, User, Menu} from "lucide-react"
import {Clock} from "../components/Clock.jsx"

const Navbar = () => {
  const {logout, authUser} = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80">
      <div className="container mx-auto h-16 px-4">
        <div className="flex items-center h-full justify-between">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
            <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-lg font-bold">ChatterBox</h1>
          </Link>

          {/* Desktop Clocks */}
          <div className="hidden lg:flex items-center gap-6 ml-8">
            <Clock timeZone="Australia/Perth" label="Perth" />
            {authUser && (
              <>
                <Clock timeZone="America/Los_Angeles" label="US West" />
                <Clock timeZone="CET" label="Berlin" />
              </>
            )}
          </div>

          {/* Desktop Nav Links */}
          {authUser && (
            <div className="hidden md:flex items-center gap-4 ml-8">
              <Link to="/settings" className="btn btn-sm gap-2">
                <Settings className="size-5" />
                <span className="hidden sm:inline">Settings</span>
              </Link>
              <Link to="/profile" className="btn btn-sm gap-2">
                <User className="size-5" />
                <span className="hidden sm:inline">Profile</span>
              </Link>
            </div>
          )}

          <div className="flex-grow" />

          {/* Desktop Logout */}
          {authUser && (
            <button className="hidden md:flex btn btn-sm gap-2" onClick={logout}>
              <LogOut className="size-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          )}

          {/* Hamburger for Mobile */}
          <button
            className="md:hidden ml-2 p-2 rounded-lg hover:bg-base-200 transition"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Open menu">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <div
        className={`md:hidden fixed top-16 left-0 w-full bg-base-100/95 border-b border-base-300 z-40 transition-all ${
          menuOpen ? "block" : "hidden"
        }`}>
        <div className="flex flex-col px-4 py-2 gap-2">
          <Clock timeZone="Australia/Perth" label="Perth" />
          {authUser && (
            <>
              <Link
                to="/settings"
                className="btn btn-sm gap-2 justify-start"
                onClick={() => setMenuOpen(false)}>
                <Settings className="size-5" />
                <span>Settings</span>
              </Link>
              <Link
                to="/profile"
                className="btn btn-sm gap-2 justify-start"
                onClick={() => setMenuOpen(false)}>
                <User className="size-5" />
                <span>Profile</span>
              </Link>
              <Clock timeZone="America/Los_Angeles" label="US West" />
              <Clock timeZone="CET" label="Berlin" />
              <button
                className="btn btn-sm gap-2 justify-start"
                onClick={() => {
                  setMenuOpen(false)
                  logout()
                }}>
                <LogOut className="size-4" />
                <span>Logout</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
