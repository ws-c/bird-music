import { create } from 'zustand'

const useStore = create((set) => {
  // 获取localStorage中的数据，如果没有则赋予默认值
  const storedSingleList =
    typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('singleList')) || []
      : []
  const storedCurrentId =
    typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('currentId')) || null
      : null
  const storedShowPlayer =
    typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('showPlayer')) || false
      : false
  return {
    singleList: storedSingleList,
    currentId: storedCurrentId,
    showPlayer: storedShowPlayer,
    isPlaying: false,
    setIsPlaying: (playing) => {
      set({ isPlaying: playing })
    },
    setSingleList: (list) => {
      set({ singleList: list })
      if (typeof window !== 'undefined') {
        localStorage.setItem('singleList', JSON.stringify(list))
      }
    },
    setCurrentId: (id) => {
      set({ currentId: id })
      if (typeof window !== 'undefined') {
        localStorage.setItem('currentId', JSON.stringify(id))
      }
    },
    setShowPlayer: (show) => {
      set({ showPlayer: show })
      if (typeof window !== 'undefined') {
        localStorage.setItem('showPlayer', JSON.stringify(show))
      }
    },
  }
})

export default useStore
