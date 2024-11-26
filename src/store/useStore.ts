import { create } from 'zustand'
import { SongList } from '../types'

type PlayList = {
  id: number
  name: string
  img: string
  author: string
  isPrivate: boolean
}

interface User {
  id: number
  username: string
  cover: string
}

// 定义 Store 的状态和方法类型
interface StoreState {
  singleList: SongList[]
  currentId: number
  showPlayer: boolean
  user: User
  isPlaying: boolean
  inputValue: string
  myPlayList: PlayList[]
  colorTheme: string
  setMyPlayList: (list: PlayList[]) => void
  setInputValue: (value: string) => void
  setIsPlaying: (playing: boolean) => void
  setSingleList: (list: any[]) => void
  setCurrentId: (id: number) => void
  setShowPlayer: (show: boolean) => void
  setUser: (newUser: User) => void
  refreshCount: number
  triggerRefresh: () => void
  setColorTheme: (theme: string) => void
}

const useStore = create<StoreState>((set) => ({
  // 初始化状态
  singleList:
    typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('singleList') || '[]')
      : [],
  currentId:
    typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('currentId') || 'null')
      : null,
  showPlayer:
    typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('showPlayer') || 'false')
      : false,
  user:
    typeof window !== 'undefined'
      ? JSON.parse(
          localStorage.getItem('user') ||
            '{"id": 0, "username": "未登录", "cover": ""}'
        )
      : { id: 0, username: '未登录', cover: '' },
  isPlaying: false,
  inputValue: '',
  myPlayList: [],
  refreshCount: 0,
  colorTheme: '',
  // 更新歌单
  setMyPlayList: (list: PlayList[]) => {
    set({ myPlayList: list })
  },
  // 更新输入值
  setInputValue: (value: string) => set({ inputValue: value }),
  // 更新播放状态
  setIsPlaying: (playing: boolean) => set({ isPlaying: playing }),
  // 更新单曲列表并存储到 localStorage
  setSingleList: (list: any[]) => {
    set({ singleList: list })
    if (typeof window !== 'undefined') {
      localStorage.setItem('singleList', JSON.stringify(list))
    }
  },
  // 更新当前 ID 并存储到 localStorage
  setCurrentId: (id: number) => {
    set({ currentId: id })
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentId', JSON.stringify(id))
    }
  },
  // 显示/隐藏播放器
  setShowPlayer: (show: boolean) => {
    set({ showPlayer: show })
    if (typeof window !== 'undefined') {
      localStorage.setItem('showPlayer', JSON.stringify(show))
    }
  },
  // 更新用户信息并存储到 localStorage
  setUser: (newUser: User) => {
    set({ user: newUser })
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(newUser))
    }
  },
  // 刷新
  triggerRefresh: () =>
    set((state) => ({ refreshCount: state.refreshCount + 1 })), // 每次调用增加计数
  // 更新主题颜色
  setColorTheme: (theme: string) => set({ colorTheme: theme }),
}))

export default useStore
