// Sound Effect by <a href="https://pixabay.com/users/freesound_community-46691455/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=40474">freesound_community</a> from <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=40474">Pixabay</a>
import useSound from 'use-sound'

export default function useLoginSound() {
  const [play] = useSound('/doorKnock.mp3', { volume: 0.4 })

  const playUnfocused = () => {
    if (!document.hasFocus() || document.visibilityState === 'hidden') {
      play()
    }
  }

  return playUnfocused
}