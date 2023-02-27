import * as React from 'react'
import * as zustand from 'zustand'
import create from 'zustand/vanilla'
import { Parser } from 'node-sql-parser'
import { assert } from 'ts-essentials'
import { ViewProps } from './View'
import { IView, ITreeItem, IViewError, ViewErrorLocation } from '../../../interfaces'
import * as helpers from './helpers'

export interface State {
  view: IView
  fieldTree?: ITreeItem[]

  // General
  viewError?: IViewError | undefined
  setQuery: (query: string) => void
  formatQuery: () => Promise<void>

}

export interface ExceptionError {
  message: string
}

export function createStore(props: ViewProps) {
  return create<State>((set, _get) => ({
    view: props.view || { query: '' },
    fieldTree: props.fields ? helpers.createTreeFromFields(props.fields) : undefined,
    viewError: props.viewError,

    // General

    setQuery: (query) => {
      const view = { query }
      set({ view })
      if (props.onViewChange) props.onViewChange(view)
    },

    formatQuery: async () => {
      const parser = new Parser()
      const { view } = _get()
      if (!view) return

      let parsedSQL

      try {
        parsedSQL = parser.astify(view.query)
      } catch (error) {
        const errorObj: IViewError = {
          message: (error as ExceptionError).message,
          location: ViewErrorLocation.Frontend,
        }
        set({ viewError: errorObj })
      }
      if (parsedSQL) {
        set({ view: { query: parser.sqlify(parsedSQL)}})
      }
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
