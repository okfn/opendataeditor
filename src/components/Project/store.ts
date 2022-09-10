import create from 'zustand'
import createContext from 'zustand/context'
import { Client } from '../../client'
import { ProjectProps } from './Project'

export interface ProjectState {
  // Data

  client: Client
  path?: string
  paths: string[]
  onPathChange: (path?: string) => void

  // Logic

  listFiles: () => Promise<void>
  createFile: (file: File) => Promise<void>
  selectFile: (path?: string) => void
  deleteFile: () => Promise<void>
}

export function makeStore(props: ProjectProps) {
  return create<ProjectState>((set, get) => ({
    // Data

    client: props.client,
    onPathChange: props.onPathChange,
    paths: [],

    // Logic

    listFiles: async () => {
      const { client } = get()
      const { paths } = await client.projectListFiles()
      set({ paths })
    },
    selectFile: (path) => {
      const { onPathChange } = get()
      if (get().path === path) return
      set({ path })
      onPathChange(path)
    },
    createFile: async (file) => {
      // TODO: show a proper error dialog
      if (file.size > 10000000) {
        alert('Currently only files under 10Mb are supported')
        return
      }
      const { client, listFiles, selectFile } = get()
      const { path } = await client.projectCreateFile({ file })
      await listFiles()
      selectFile(path)
    },
    deleteFile: async () => {
      const { client, path, listFiles, selectFile } = get()
      if (!path) return
      await client.projectDeleteFile({ path })
      await listFiles()
      selectFile(undefined)
    },
  }))
}
export const { Provider, useStore } = createContext<ProjectState>()
