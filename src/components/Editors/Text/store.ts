import * as React from 'react'
import * as zustand from 'zustand'
import { assert } from 'ts-essentials'
import { createStore } from 'zustand/vanilla'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { ITextContent } from '../../../interfaces'
import { createSelector } from 'reselect'
import { TextProps } from './Text'
import * as helpers from './helpers'
// @ts-expect-error
import dirtyJson from 'dirty-json'

interface State {
  format?: string
  content?: ITextContent
  onChange: (text: any) => void
  updateState: (patch: Partial<State>) => void
  editor: React.RefObject<monaco.editor.IStandaloneCodeEditor>
  init: () => void
  clear: () => void
  fix: () => void
  minify: () => void
  prettify: () => void
}

export function makeStore(props: TextProps) {
  return createStore<State>((set, get) => ({
    format: props.format,
    onChange: props.onChange,
    editor: React.createRef<monaco.editor.IStandaloneCodeEditor>(),
    updateState: (patch) => {
      set(patch)
    },

    // Text

    init: () => {
      console.log(props)
      // We use it to reload editor instance on a new store created
      set({ content: props.content })
    },
    clear: () => {
      const { editor } = get()
      if (!editor.current) return
      editor.current.setValue('')
    },

    // Json

    fix: () => {
      const { editor } = get()
      if (!editor.current) return
      const value = editor.current.getValue()
      const fixedValue = value && dirtyJson.parse(value)
      const formattedValue =
        fixedValue && helpers.prettifyJsonString(JSON.stringify(fixedValue))
      editor.current.setValue(formattedValue)
    },
    minify: () => {
      const { editor } = get()
      if (!editor.current) return
      const value = editor.current.getValue()
      if (!value) return
      const minifiedValue = helpers.minifyJsonString(value)
      editor.current.setValue(minifiedValue)
    },
    prettify: () => {
      const { editor } = get()
      if (!editor.current) return
      const action = editor.current.getAction('editor.action.formatDocument')
      if (!action) return
      action.run()
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
