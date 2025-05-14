import {create} from "zustand"

export const DEFAULT = "halloween"

export const useTheme = create((set) => ({
  theme: localStorage.getItem("chat-theme") || DEFAULT,
  setTheme: (theme) => {
    localStorage.setItem("chat-theme", theme)
    set({theme})
  },
}))
