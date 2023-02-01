import * as React from 'react'
import * as zustand from 'zustand'
import create from 'zustand/vanilla'
import { assert } from 'ts-essentials'
import { Client } from '../../../client'
import { FilesProps } from './Files'
import { IFileItem, ITreeItem } from '../../../interfaces'
import * as helpers from '../../../helpers'

type IDialog =
  | 'folder/copyFile'
  | 'folder/moveFile'
  | 'name/renameFile'
  | 'name/createFolder'

export interface State {
  client: Client
  path?: string
  fileItems: IFileItem[]
  onFileChange: (path?: string) => void
  dialog?: IDialog

  // General

  setPath: (path?: string) => void
  setDialog: (dialog?: IDialog) => void

  // File

  copyFile: (folder: string) => Promise<void>
  createFile: (file: File) => Promise<void>
  createFolder: (name: string) => Promise<void>
  deleteFile: () => Promise<void>
  listFiles: () => Promise<void>
  moveFile: (folder: string) => Promise<void>
  renameFile: (name: string) => Promise<void>

  // Package

  createPackage: () => Promise<void>
}

export function createStore(props: FilesProps) {
  return create<State>((set, get) => ({
    client: props.client,
    onFileChange: props.onFileChange,
    fileItems: [],

    // General

    setDialog: (dialog) => set({ dialog }),
    setPath: (newPath) => {
      const { path, onFileChange } = get()
      if (path === newPath) return
      set({ path: newPath })
      const isFolder = selectors.isFolder(get())
      if (!isFolder) onFileChange(newPath)
    },

    // File

    copyFile: async (folder) => {
      const { client, path, listFiles } = get()
      if (!path) return
      await client.fileCopy({ path, folder })
      await listFiles()
    },
    createFile: async (file) => {
      // TODO: show a proper error dialog
      if (file.size > 10000000) {
        alert('Currently only files under 10Mb are supported')
        return
      }
      const { client, listFiles, setPath } = get()
      const folder = selectors.folderPath(get())
      const result = await client.fileCreate({ file, folder })
      await listFiles()
      setPath(result.path)
    },
    createFolder: async (name) => {
      const { client, listFiles } = get()
      const folder = selectors.folderPath(get())
      await client.fileCreateFolder({ name, folder })
      await listFiles()
    },
    deleteFile: async () => {
      const { client, path, listFiles, setPath } = get()
      if (!path) return
      await client.fileDelete({ path })
      await listFiles()
      setPath(undefined)
    },
    listFiles: async () => {
      const { client } = get()
      const { items } = await client.fileList()
      set({ fileItems: items })
    },
    moveFile: async (folder) => {
      const { client, path, listFiles } = get()
      if (!path) return
      await client.fileMove({ path, folder })
      await listFiles()
    },
    renameFile: async (name) => {
      const { client, path, listFiles } = get()
      if (!path) return
      await client.fileRename({ path, name })
      await listFiles()
    },

    // Package

    createPackage: async () => {
      const { client, listFiles, setPath } = get()
      const { path } = await client.packageCreate()
      await listFiles()
      setPath(path)
    },
  }))
}

export const selectors = {
  filePaths: (state: State) => {
    return state.fileItems
      .filter((item) => item.type === 'folder')
      .map((item) => item.path)
  },
  isFolder: (state: State) => {
    return !!state.fileItems.find(
      (item) => item.path === state.path && item.type === 'folder'
    )
  },
  folderPath: (state: State) => {
    if (!state.path) return undefined
    const isFolder = selectors.isFolder(state)
    if (isFolder) return state.path
    return helpers.getFolderPath(state.path)
  },
  fileTree: (state: State) => {
    return helpers.createFileTree(state.fileItems)
  },
  targetTree: (state: State) => {
    const fileTree = helpers.createFileTree(state.fileItems, ['folder'])
    const targetTree: ITreeItem[] = [
      { name: 'Project', path: '.', type: 'folder', children: fileTree },
    ]
    return targetTree
  },
}

export function useStore<R>(selector: (state: State) => R): R {
  const store = React.useContext(StoreContext)
  assert(store, 'store provider is required')
  return zustand.useStore(store, selector)
}

const StoreContext = React.createContext<zustand.StoreApi<State> | null>(null)
export const StoreProvider = StoreContext.Provider
