import create from 'zustand'

export interface IState {
  file?: File
  page: string
}

export interface ILogic {
  setPage: (page: string) => void
}

export const initialState = {
  page: 'home',
}

export const useStore = create<IState | ILogic>((set) => ({
  ...initialState,
  setPage: (page) => {
    set({ page })
  },
}))
