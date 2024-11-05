import { create } from 'zustand'

const useStore = create((set) => ({
  singleList: [],
  currentId: null,
  setSingleList: (list) => set({ singleList: list }),
  setCurrentId: (id) => set({ currentId: id }),
  showPlayer: false,
  setShowPlayer: (show) => set({ showPlayer: show }),
}))

export default useStore
