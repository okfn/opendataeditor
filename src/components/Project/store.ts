import create from 'zustand'
import createContext from 'zustand/context'
import { client } from '../../client'
import { ISession } from '../../interfaces'
import { ProjectProps } from './Project'

export interface ProjectState {
  session?: ISession
  path?: string
  paths: string[]
  onFileChange: (path?: string) => void
}

export interface ProjectLogic {
  listFiles: () => Promise<void>
  createFile: (file: File) => Promise<void>
  selectFile: (path?: string) => void
  deleteFile: () => Promise<void>
}

export function makeStore(props: ProjectProps) {
  const initialState = {
    session: props.session,
    onFileChange: props.onFileChange,
    paths: [],
  }
  return create<ProjectState & ProjectLogic>((set, get) => ({
    ...initialState,

    listFiles: async () => {
      const { session } = get()
      const { paths } = await client.projectListFiles({ session })
      set({ paths })
    },
    selectFile: (path) => {
      const { onFileChange } = get()
      if (get().path === path) return
      set({ path })
      onFileChange(path)
    },
    createFile: async (file) => {
      // TODO: rework this limitation
      const isCsv = file.name.endsWith('.csv')
      const isExcel = file.name.endsWith('.xlsx')
      if (!(isCsv || isExcel) || file.size > 10000000) {
        alert('Currently only CSV and Excel files under 10Mb are supported')
        return
      }
      const { session, listFiles, selectFile } = get()
      const { path } = await client.projectCreateFile({ session, file })
      await listFiles()
      selectFile(path)
    },
    deleteFile: async () => {
      const { session, path, listFiles, selectFile } = get()
      if (!path) return
      await client.projectDeleteFile({ session, path })
      await listFiles()
      selectFile(undefined)
    },
  }))
}
export const { Provider, useStore } = createContext<ProjectState & ProjectLogic>()
