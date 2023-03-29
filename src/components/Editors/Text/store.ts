import * as React from 'react'
import * as zustand from 'zustand'
import { assert } from 'ts-essentials'
import { createStore } from 'zustand/vanilla'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { createSelector } from 'reselect'
import { TextProps } from './Text'

interface State {
  text: string
  format?: string
  onChange: (value: any) => void
  editor: React.RefObject<monaco.editor.IStandaloneCodeEditor>
  clear: () => void
}

export function makeStore(props: TextProps) {
  return createStore<State>((_set, get) => ({
    ...props,
    editor: React.createRef<monaco.editor.IStandaloneCodeEditor>(),

    // Text

    clear: () => {
      const { editor } = get()
      editor.current?.setValue('')
    },
  }))
}

export const select = createSelector
export const selectors = {
  language: (state: State) => {
    switch (state.format) {
      case 'json':
        return 'json'
      case 'md':
        return 'markdown'
      default:
        return 'plaintext'
    }
  },
}

export function useStore<R>(selector: (state: State) => R): R {
  const store = React.useContext(StoreContext)
  assert(store, 'store provider is required')
  return zustand.useStore(store, selector)
}

const StoreContext = React.createContext<zustand.StoreApi<State> | null>(null)
export const StoreProvider = StoreContext.Provider
