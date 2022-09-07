import create from 'zustand'
import { client } from '../../client'
import { ISession } from '../../interfaces'

export interface IState {
  session?: ISession
  path?: string
}

export interface ILogic {
  ensureProject: () => Promise<void>
  selectPath: (path?: string) => void
}

export const initialState = {}

export const useStore = create<IState & ILogic>((set, get) => ({
  ...initialState,

  ensureProject: async () => {
    if (get().session) return
    const { session } = await client.projectCreate()
    set({ session })
  },
  selectPath: (path) => {
    set({ path })
  },
}))
