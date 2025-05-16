// Sound Effect by <a href="https://pixabay.com/users/freesound_community-46691455/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=40474">freesound_community</a> from <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=40474">Pixabay</a>
import {useRef, useEffect} from "react"

export default function useLoginSound() {
  const soundUrl = "/doorKnock.mp3"
  const volume = 0.2
  const audioRef = useRef(null)

  useEffect(() => {
    const prepareAudio = () => {
      if (!audioRef.current) {
        audioRef.current = new Audio(soundUrl)
        audioRef.current.volume = volume
        audioRef.current.muted = true
        audioRef.current
          .play()
          .then(() => {
            audioRef.current.muted = false
          })
          .catch(() => {})
      }

      window.removeEventListener("click", prepareAudio)
    }
    window.addEventListener("click", prepareAudio)

    return () => window.removeEventListener("click", prepareAudio)
  }, [soundUrl, volume])

  const playUnfocused = () => {
    if (!document.hasFocus() || document.visibilityState === "hidden") {
      if (audioRef.current) {
        audioRef.current.volume = volume
        audioRef.current.play()
      }
    }
  }

  return playUnfocused
}
