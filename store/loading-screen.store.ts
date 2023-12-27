import { create } from 'zustand'

interface LoadingScreenState {
  loadingText: string
  isShowing: boolean
  showLoading: (loadingText: string) => void
  hiddenLoading: () => void
}

export const useLoadingScreenStore = create<LoadingScreenState>()((set) => ({
  loadingText: '',
  isShowing: false,
  showLoading: (loadingText) => set({ loadingText, isShowing: true }),
  hiddenLoading: () => set({ loadingText: '', isShowing: false })
}))
