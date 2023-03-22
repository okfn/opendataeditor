import * as React from 'react'
import * as zustand from 'zustand'
import yaml from 'js-yaml'
import FileSaver from 'file-saver'
import { createStore } from 'zustand/vanilla'
import { assert } from 'ts-essentials'
import { MetadataProps } from './Metadata'

export interface IEditorState {
  editor?: 'package' | 'resource' | 'dialect' | 'schema'
  descriptor?: object
  isPreview?: boolean
}

export interface State {
  editorState: IEditorState
  updateEditorState: (patch: Partial<IEditorState>) => void
  importDescriptor: (file: File) => void
  exportDescriptor: () => void
}

export function makeStore(_props: MetadataProps) {
  return createStore<State>((set, get) => ({
    editorState: {},
    updateEditorState: (patch) => {
      const { editorState } = get()
      if ('editor' in patch) {
        patch.descriptor = undefined
        patch.isPreview = undefined
      }
      set({ editorState: { ...editorState, ...patch } })
    },
    importDescriptor: async (file) => {
      const { updateEditorState } = get()
      const text = (await file.text()).trim()
      const isYaml = !text.startsWith('{')
      // TODO: handle errors and validate descriptor
      const descriptor = isYaml ? yaml.load(text) : JSON.parse(text)
      updateEditorState({ descriptor })
    },
    exportDescriptor: () => {
      const { editorState } = get()
      const text = JSON.stringify(editorState.descriptor, null, 2)
      const blob = new Blob([text], { type: 'text/json;charset=utf-8' })
      FileSaver.saveAs(blob, `${editorState.editor}.json`)
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
