import create from 'zustand'

export interface IState {
  file?: File
  page: string
}

export interface ILogic {
  uploadFile: (file: File) => void
}

export const initialState = {
  page: 'home',
}

export const useStore = create<IState | ILogic>((set) => ({
  ...initialState,
  uploadFile: (file) => {
    if (file.type !== 'text/csv' || file.size > 10000000) {
      // TODO: clean file input
      alert('Currently only CSV files under 10Mb are supported')
      set({})
    }
    // TODO: implement properly
    // const text = await file.text()
    // const patch = await describe(file)
    // return { ...state, file, text, page: 'describe', ...patch }
  },
}))
