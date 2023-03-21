import * as React from 'react'
import * as zustand from 'zustand'
import { createStore } from 'zustand/vanilla'
import { assert } from 'ts-essentials'
import { MetadataProps } from './Metadata'

export interface IEditorState {
  editor?: 'package' | 'resource' | 'dialect' | 'schema'
}

export interface State {
  editorState: IEditorState
  updateEditorState: (patch: Partial<IEditorState>) => void
}

export function makeStore(_props: MetadataProps) {
  return createStore<State>((set, get) => ({
    editorState: {},
    updateEditorState: (patch) => {
      const { editorState } = get()
      set({ editorState: { ...editorState, ...patch } })
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
