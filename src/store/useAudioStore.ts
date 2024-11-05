import { create } from 'zustand'

const useAudioStore = create((set) => ({
  audioRef: new Audio(),
  isPlaying: false,
  setIsPlaying: () =>
    set((state) => {
      if (state.isPlaying) {
        state.audioRef.pause()
      } else {
        state.audioRef.play()
      }
      return { isPlaying: !state.isPlaying }
    }),
}))

export default useAudioStore
