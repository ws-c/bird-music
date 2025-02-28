import { create } from 'zustand'
import { SongList } from '@/types'

type PlayList = {
  id: number
  name: string
  img: string
  author: string
  isPrivate: string
}

interface User {
  id: number
  username: string
  cover: string
}

// 定义 Store 的状态和方法类型
interface StoreState {
  singleList: SongList[] // 播放列表
  preSingleList: SongList[] // 历史播放列表
  currentId: number // 当前播放歌曲的 id
  showPlayer: boolean // 播放器是否显示
  user: User // 用户信息
  isPlaying: boolean // 是否播放
  isLove: boolean // 是否喜欢
  inputValue: string // 搜索框的值
  myPlayList: PlayList[] // 自己创建的歌单
  collectPlayList: PlayList[] // 收藏歌单
  colorTheme: string // 颜色主题
  refreshCount: number // 用于触发刷新的计数器
  setMyPlayList: (list: PlayList[]) => void
  setCollectPlayList: (list: PlayList[]) => void
  setInputValue: (value: string) => void
  setIsPlaying: (playing: boolean) => void
  setSingleList: (list: any[]) => void
  setPreSingleList: (list: any[]) => void
  setCurrentId: (id: number) => void
  setShowPlayer: (show: boolean) => void
  setUser: (newUser: User) => void
  triggerRefresh: () => void
  setColorTheme: (theme: string) => void
  setIsLove: (love: boolean) => void
}

const useStore = create<StoreState>((set) => ({
  // 初始化状态
  singleList:
    typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('singleList') || '[]')
      : [],
  preSingleList:
    typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('preSingleList') || '[]')
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
  collectPlayList: [],
  refreshCount: 0,
  colorTheme: '',
  isLove: false,
  // 更新我创建的歌单
  setMyPlayList: (list: PlayList[]) => {
    set({ myPlayList: list })
  },
  // 更新我收藏的歌单
  setCollectPlayList: (list: PlayList[]) => {
    set({ collectPlayList: list })
  },
  // 更新输入值
  setInputValue: (value: string) => set({ inputValue: value }),
  // 更新播放状态
  setIsPlaying: (playing: boolean) => set({ isPlaying: playing }),
  // 更新喜欢状态
  setIsLove: (isLove: boolean) => set({ isLove: isLove }),
  // 更新单曲列表并存储到 localStorage
  setSingleList: (list: any[]) => {
    set({ singleList: list })
    if (typeof window !== 'undefined') {
      localStorage.setItem('singleList', JSON.stringify(list))
    }
  },
  // 更新历史单曲列表并存储到 localStorage
  setPreSingleList: (list: any[]) => {
    set({ preSingleList: list })
    if (typeof window !== 'undefined') {
      localStorage.setItem('preSingleList', JSON.stringify(list))
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
