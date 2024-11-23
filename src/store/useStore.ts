import { create } from 'zustand'

type PlayList = {
  id: number
  name: string
  img: string
  author: string
  isPrivate: boolean
}
// 定义 Store 的状态和方法类型
interface StoreState {
  singleList: any[]
  currentId: string | null
  showPlayer: boolean
  name: string
  isPlaying: boolean
  inputValue: string
  myPlayList: PlayList[] // 新增歌单状态
  setMyPlayList: (list: PlayList[]) => void // 新增设置歌单的方法
  setInputValue: (value: string) => void
  setIsPlaying: (playing: boolean) => void
  setSingleList: (list: any[]) => void
  setCurrentId: (id: string | null) => void
  setShowPlayer: (show: boolean) => void
  setName: (newName: string) => void
}

const useStore = create<StoreState>((set) => {
  return {
    singleList: JSON.parse(localStorage.getItem('singleList') || '[]'),
    currentId: JSON.parse(localStorage.getItem('currentId') || 'null'),
    showPlayer: JSON.parse(localStorage.getItem('showPlayer') || 'false'),
    name: localStorage.getItem('name') || '未登录',
    isPlaying: false,
    inputValue: '',
    myPlayList: [],
    setMyPlayList: (list: PlayList[]) => {
      set({ myPlayList: list })
    },
    setInputValue: (value: string) => set({ inputValue: value }),
    setIsPlaying: (playing: boolean) => set({ isPlaying: playing }),
    setSingleList: (list: any[]) => {
      set({ singleList: list })
      localStorage.setItem('singleList', JSON.stringify(list))
    },
    setCurrentId: (id: string | null) => {
      set({ currentId: id })
      localStorage.setItem('currentId', JSON.stringify(id))
    },
    setShowPlayer: (show: boolean) => {
      set({ showPlayer: show })
      localStorage.setItem('showPlayer', JSON.stringify(show))
    },
    setName: (newName: string) => {
      set({ name: newName })
      localStorage.setItem('name', newName)
    },
  }
})

export default useStore
