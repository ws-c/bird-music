import { create } from 'zustand'

// 定义 Store 的状态和方法类型
interface StoreState {
  singleList: any[] // 定义为数组类型，可以根据具体数据结构进一步细化
  currentId: string | null // currentId 可以是 string 或 null
  showPlayer: boolean // 播放器是否显示的状态
  name: string // 用户名
  isPlaying: boolean // 是否正在播放的状态
  inputValue: string // 输入框的值
  setInputValue: (value: string) => void // 设置输入框的值
  setIsPlaying: (playing: boolean) => void
  setSingleList: (list: any[]) => void
  setCurrentId: (id: string | null) => void
  setShowPlayer: (show: boolean) => void
  setName: (newName: string) => void
}

const useStore = create<StoreState>((set) => {
  // 获取localStorage中的数据，如果没有则赋予默认值
  const storedSingleList =
    typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('singleList') || '[]')
      : []
  const storedCurrentId =
    typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('currentId') || 'null')
      : null
  const storedShowPlayer =
    typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('showPlayer') || 'false')
      : false
  const storedName =
    typeof window !== 'undefined'
      ? localStorage.getItem('name') || '未登录'
      : '未登录'
  return {
    singleList: storedSingleList,
    currentId: storedCurrentId,
    showPlayer: storedShowPlayer,
    name: storedName,
    isPlaying: false,
    inputValue: '',
    
    setInputValue: (value: string) => {
      set({ inputValue: value })
    },
    setIsPlaying: (playing: boolean) => {
      set({ isPlaying: playing })
    },
    setSingleList: (list: any[]) => {
      set({ singleList: list })
      if (typeof window !== 'undefined') {
        localStorage.setItem('singleList', JSON.stringify(list))
      }
    },
    setCurrentId: (id: string | null) => {
      set({ currentId: id })
      if (typeof window !== 'undefined') {
        localStorage.setItem('currentId', JSON.stringify(id))
      }
    },
    setShowPlayer: (show: boolean) => {
      set({ showPlayer: show })
      if (typeof window !== 'undefined') {
        localStorage.setItem('showPlayer', JSON.stringify(show))
      }
    },
    setName: (newName: string) => {
      set({ name: newName })
      if (typeof window !== 'undefined') {
        localStorage.setItem('name', newName)
      }
    },
  }
})

export default useStore
