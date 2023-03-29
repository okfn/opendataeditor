import * as React from 'react'
import * as zustand from 'zustand'
import yaml from 'js-yaml'
import FileSaver from 'file-saver'
import { createStore } from 'zustand/vanilla'
import { assert } from 'ts-essentials'
import { MetadataProps } from './Metadata'

export interface State {
  editor?: 'package' | 'resource' | 'dialect' | 'schema'
  descriptor?: object
  isPreview?: boolean
  revision: number
  updateState: (patch: Partial<State>) => void
  importDescriptor: (file: File) => void
  exportDescriptor: () => void
}

export function makeStore(_props: MetadataProps) {
  return createStore<State>((set, get) => ({
    revision: 0,
    updateState: (patch) => {
      const { revision } = get()
      if ('editor' in patch) {
        patch.descriptor = undefined
        patch.isPreview = false
        patch.revision = 0
      }
      if ('descriptor' in patch) {
        patch.revision = revision + 1
      }
      set({ ...patch })
    },
    importDescriptor: async (file) => {
      const text = (await file.text()).trim()
      const isYaml = !text.startsWith('{')
      // TODO: handle errors and validate descriptor
      const descriptor = isYaml ? yaml.load(text) : JSON.parse(text)
      set({ descriptor })
    },
    exportDescriptor: () => {
      const { editor, descriptor } = get()
      const text = JSON.stringify(descriptor, null, 2)
      const blob = new Blob([text], { type: 'text/json;charset=utf-8' })
      FileSaver.saveAs(blob, `${editor}.json`)
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
