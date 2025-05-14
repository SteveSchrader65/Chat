import {create} from "zustand"
import {persist} from "zustand/middleware"

export const useFontsizer = create(
  persist(
    (set) => ({
      fontSize: 16,
      setFontSize: (size) => set({fontSize: size}),
    }),
    {
      name: "squirrelFontsizer",
    }
  )
)