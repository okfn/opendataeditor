import create from 'zustand'
import createContext from 'zustand/context'
import { client } from '../../client'
import { ISession } from '../../interfaces'
import { ProjectProps } from './Project'

export interface ProjectState {
  session?: ISession
  path?: string
  paths: string[]
  onPathChange: (path: string) => void
}

export interface ProjectLogic {
  uploadFile: (file: File) => void
}

export function makeStore(props: ProjectProps) {
  const initialState = {
    session: props.session,
    onPathChange: props.onPathChange,
    paths: [],
  }
  return create<ProjectState & ProjectLogic>((set, get) => ({
    ...initialState,

    uploadFile: async (file) => {
      const isCsv = file.name.endsWith('.csv')
      const isExcel = file.name.endsWith('.xlsx')
      if (!(isCsv || isExcel) || file.size > 10000000) {
        // TODO: clean file input
        alert('Currently only CSV and Excel files under 10Mb are supported')
        return
      }
      const { session, onPathChange } = get()
      const { path } = await client.projectCreateFile({ session, file })
      const { paths } = await client.projectListFiles({ session })
      set({ path, paths })
      onPathChange(path)
    },
  }))
}
export const { Provider, useStore } = createContext<ProjectState & ProjectLogic>()
