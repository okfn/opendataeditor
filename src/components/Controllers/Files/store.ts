import * as React from 'react'
import * as zustand from 'zustand'
import create from 'zustand/vanilla'
import { assert } from 'ts-essentials'
import { Client } from '../../../client'
import { FilesProps } from './Files'
import * as helpers from '../../../helpers'

type IDialog = 'folder' | 'copy' | 'move'

export interface State {
  client: Client
  path?: string
  paths: string[]
  folders: string[]
  onPathChange: (path?: string) => void
  dialog?: IDialog

  // General

  setPath: (path?: string) => void
  setDialog: (dialog?: IDialog) => void

  // Files

  listFiles: () => Promise<void>
  createFile: (file: File) => Promise<void>
  deleteFile: () => Promise<void>
  createPackage: () => Promise<void>
  listFolders: () => Promise<void>
  moveFile: (target: string) => Promise<void>
  createFolder: (path: string) => Promise<void>
  copyFile: (target: string) => Promise<void>
}

export function createStore(props: FilesProps) {
  return create<State>((set, get) => ({
    client: props.client,
    onPathChange: props.onPathChange,
    paths: [],
    folders: [],

    // General

    setDialog: (dialog) => set({ dialog }),
    setPath: (newPath) => {
      const { path, onPathChange } = get()
      if (path === newPath) return
      set({ path: newPath })
      onPathChange(newPath)
    },

    // Files

    listFiles: async () => {
      const { client } = get()
      const { paths } = await client.fileList()
      set({ paths })
    },
    createFile: async (file) => {
      // TODO: show a proper error dialog
      if (file.size > 10000000) {
        alert('Currently only files under 10Mb are supported')
        return
      }
      const { path, client, listFiles, setPath } = get()
      const folder = path ? helpers.getFolder(path) : undefined
      const result = await client.fileCreate({ file, folder })
      await listFiles()
      setPath(result.path)
    },
    deleteFile: async () => {
      const { client, path, listFiles, setPath } = get()
      if (!path) return
      await client.fileDelete({ path })
      await listFiles()
      setPath(undefined)
    },
    createPackage: async () => {
      const { client, listFiles, setPath } = get()
      const { path } = await client.packageCreate()
      await listFiles()
      setPath(path)
    },
    moveFile: async (target) => {
      const { client, path, listFiles } = get()
      if (!path) return
      if (target === 'root') target = ''
      await client.fileMove({ source: path, target })
      await listFiles()
    },
    listFolders: async () => {
      const { client } = get()
      const { paths } = await client.fileList({ onlyFolders: true })
      set({ folders: paths })
    },
    createFolder: async (path) => {
      const { client, listFiles } = get()
      await client.fileCreateFolder({ path })
      await listFiles()
    },
    copyFile: async (target) => {
      const { client, path, listFiles } = get()
      if (!path) return
      await client.fileCopy({ source: path, target })
      await listFiles()
    },
  }))
}

export function useStore<R>(selector: (state: State) => R): R {
  const store = React.useContext(StoreContext)
  assert(store, 'store provider is required')
  return zustand.useStore(store, selector)
}

const StoreContext = React.createContext<zustand.StoreApi<State> | null>(null)
export const StoreProvider = StoreContext.Provider
