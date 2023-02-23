import * as React from 'react'
import * as zustand from 'zustand'
import create from 'zustand/vanilla'
import { assert } from 'ts-essentials'
import { ViewProps } from './View'
import { IView, ITreeItem } from '../../../interfaces'
import * as helpers from './helpers'

export interface State {
  view: IView
  fieldTree?: ITreeItem[]

  // General
  message?: string | undefined
  setQuery: (query: string) => void
}


export function createStore(props: ViewProps) {
  return create<State>((set, _get) => ({
    view: props.view || { query: '' },
    fieldTree: props.fields ? helpers.createTreeFromFields(props.fields) : undefined,

    // General

    setQuery: (query) => {
      const view = { query }
      set({ view })
      if (props.onViewChange) props.onViewChange(view)
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
