import {useState, useEffect, useRef} from "react"
import {useAuth} from "../hooks/useAuth"
import {useTheme} from "../hooks/useTheme"
import {useDebounce} from "../hooks/useDebounce"
import {Camera, Edit, Eye, EyeOff, Lock, Mail, Save, User} from "lucide-react"
import toast from "react-hot-toast"

const ProfilePage = () => {
  const {authUser, isUpdatingProfile, updateProfile, checkAuth} = useAuth()
  const [selectedImg, setSelectedImg] = useState(null)
  const [userName, setUserName] = useState(authUser.userName)
  const [editingUserName, setEditingUserName] = useState(false)
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [editingPassword, setEditingPassword] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const passwordRef = useRef(null)
  const {theme} = useTheme()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  useEffect(() => {
    if (editingPassword && passwordRef.current) {
      passwordRef.current.focus()
    }
  }, [editingPassword])

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    const reader = new FileReader()

    if (!file) return

    if (file.size > 100 * 1024) {
      toast.error("File too large. Max: 100kb")
      return
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed.")
      return
    }

    reader.readAsDataURL(file)

    reader.onload = async () => {
      const profileImage = reader.result

      setSelectedImg(profileImage)
      await updateProfile({profilePic: profileImage})
    }
  }

  const submitUsername = async () => {
    if (userName.trim() === "") {
      toast.error("Username cannot be empty")
      return
    }
    await updateProfile({userName})
  }

  const resetUsername = () => setEditingUserName(false)

  const {
    handleSubmit: handleUsernameSubmit,
    isSubmitting: isSubmittingUsername,
    error: usernameError,
  } = useDebounce(submitUsername, resetUsername)

  const submitPassword = async () => {
    if (!password || password.length < 6) {
      toast.error("Password must be at least 6 characters")
      return
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }
    await updateProfile({password})
  }

  const resetPassword = () => {
    setEditingPassword(false)
    setPassword("")
    setConfirmPassword("")
  }

  const {
    handleSubmit: handlePasswordSubmit,
    isSubmitting: isSubmittingPassword,
    error: passwordError,
  } = useDebounce(submitPassword, resetPassword)

  const passwordsMatch = password && confirmPassword && password === confirmPassword

  return (
    <div data-theme={theme} className="min-h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold ">Profile</h1>
          </div>

          {/* Avatar upload section */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4 "
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                `}>
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
            </p>
          </div>
          <div className="space-y-6">

            {/* UserName display and edit */}
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="size-4" />
                User Name
              </div>
              {editingUserName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="input input-bordered w-full"
                    disabled={isUpdatingProfile}
                  />
                  <button
                    onClick={handleUsernameSubmit}
                    className="p-2 bg-green-600 hover:bg-green-800 rounded-lg transition-colors"
                    disabled={isUpdatingProfile || isSubmittingUsername}>
                    <Save className="size-5" />
                  </button>
                  {usernameError && (
                    <p className="text-red-500 text-sm">
                      {usernameError.message || "Failed to update username"}
                    </p>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <p className="px-4 py-2.5 bg-base-200 rounded-lg border flex-grow">
                    {authUser?.userName}
                  </p>
                  <button
                    onClick={() => setEditingUserName(true)}
                    className="p-2 bg-base-200 hover:bg-base-100 rounded-lg transition-colors"
                    disabled={isUpdatingProfile}>
                    <Edit className="size-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Display email address */}
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.email}</p>
            </div>

            {/* Password display and edit */}
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Lock className="size-4" />
                Password
              </div>
              {editingPassword ? (
                <div className="space-y-3">
                  <div className="relative">
                    <input
                      ref={passwordRef}
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="input input-bordered w-full"
                      disabled={isUpdatingProfile}
                      minLength={6}
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={() => setShowPassword((visible) => !visible)}>
                      {showPassword ? <EyeOff /> : <Eye />}
                    </button>
                  </div>

                  {/* Confirm Password Input */}
                  <div className="flex items-center gap-2">
                    <div className="relative w-[95%]">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        className={`input input-bordered w-full pr-10 ${
                          confirmPassword && password !== confirmPassword
                            ? "border-red-500"
                            : confirmPassword && passwordsMatch
                            ? "border-green-500"
                            : ""
                        }`}
                        disabled={isUpdatingProfile}
                      />
                      <button
                        type="button"
                        tabIndex={-1}
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        onClick={() => setShowConfirmPassword((v) => !v)}>
                        {showConfirmPassword ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                    <button
                      onClick={handlePasswordSubmit}
                      className={`p-2 bg-green-600 hover:bg-green-800 rounded-lg transition-colors flex items-center disabled:opacity-50`}
                      disabled={
                        isUpdatingProfile ||
                        isSubmittingPassword ||
                        !passwordsMatch ||
                        password.length < 6
                      }>
                      <Save className="size-5" />
                    </button>
                    {passwordError && (
                      <p className="text-red-500 text-sm">
                        {passwordError.message || "Failed to update password"}
                      </p>
                    )}
                  </div>
                  {passwordsMatch && <p className="text-sm text-green-600 mt-1">Passwords Match</p>}
                  {confirmPassword && password !== confirmPassword && (
                    <p className="text-sm text-red-500 mt-1">Passwords do not match</p>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <p className="px-4 py-2.5 bg-base-200 rounded-lg border flex-grow">••••••••</p>
                  <button
                    onClick={() => setEditingPassword(true)}
                    className="p-2 bg-base-200 hover:bg-base-100 rounded-lg transition-colors"
                    disabled={isUpdatingProfile}>
                    <Edit className="size-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium  mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>
                  {authUser?.createdAt
                    ? new Date(authUser.createdAt).toLocaleDateString()
                    : "Fetching ..."}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
