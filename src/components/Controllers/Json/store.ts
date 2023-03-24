import * as React from 'react'
import * as zustand from 'zustand'
import { createStore } from 'zustand/vanilla'
import { assert } from 'ts-essentials'
import { Client } from '../../../client'
import { IFile } from '../../../interfaces'
import { JsonProps } from './Json'

export interface State {
  client: Client
  file: IFile
  json?: string
  newFile: File | undefined

  // General

  commitChange: () => Promise<void>
  exportJson: () => Promise<ArrayBuffer | undefined>
  loadJson: () => Promise<void>
  updateChange: (newFile: File) => void
  downloadFile: () => Promise<ArrayBuffer | undefined>
  onSave: (path: string) => void
}

export function makeStore(props: JsonProps) {
  return createStore<State>((set, get) => ({
    ...props,
    newFile: undefined,

    // General

    commitChange: async () => {
      const { client, newFile, onSave } = get()
      if (!newFile) return
      const { path } = await client.fileSave({ file: newFile })
      set({ newFile: undefined })
      onSave(path)
    },
    exportJson: async () => {
      const { client, file } = get()
      if (!file.path) return
      const { bytes } = await client.bytesRead({ path: file.path })
      return bytes
    },
    loadJson: async () => {
      const { client, file } = get()
      const { text } = await client.textRead({ path: file.path })
      set({ json: text })
    },
    updateChange: (newFile: File) => set({ newFile }),
    // TODO: temporary solution
    downloadFile: async () => {
      const { client, newFile, file } = get()
      let downloadFilePath = file.path
      if (newFile) {
        const { path } = await client.fileSave({ file: newFile })
        downloadFilePath = path
      }
      const { bytes } = await client.bytesRead({ path: downloadFilePath })
      return bytes
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
