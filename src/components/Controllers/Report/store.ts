import * as React from 'react'
import * as zustand from 'zustand'
import create from 'zustand/vanilla'
import { assert } from 'ts-essentials'
import { Client } from '../../../client'
import { IFile } from '../../../interfaces'
import { ReportProps } from './Report'

export interface State {
  client: Client
  file: IFile
  isSource?: boolean
  toggleSource: () => void

  // General

  exporter: () => void
}

export function createStore(props: ReportProps) {
  return create<State>((set, get) => ({
    client: props.client,
    file: props.file,

    // General

    toggleSource: () => set({ isSource: !get().isSource }),
    exporter: () => {
      // TODO: implement
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
