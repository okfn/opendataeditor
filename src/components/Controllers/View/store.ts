import * as React from 'react'
import * as zustand from 'zustand'
import create from 'zustand/vanilla'
import { Parser } from 'node-sql-parser'
import { assert } from 'ts-essentials'
import { IFile, IViewError, ViewErrorLocation } from '../../../interfaces'
import { Client } from '../../../client'
import { ITable, IView, IFieldItem } from '../../../interfaces'
import { SqlProps } from './Sql'

export interface State {
  client: Client
  file?: IFile
  view?: IView
  fields?: IFieldItem[]
  tables?: string[]
  table?: ITable
  viewError?: IViewError

  // General

  setView: (view?: IView) => void
  loadFields: () => Promise<void>
  makeQuery: () => Promise<void>
}

export interface ExceptionError {
  message: string
}

export function createStore(props: SqlProps) {
  return create<State>((set, get) => ({
    client: props.client,
    file: props.file,

    // General

    setView: (view) => set({ view }),
    loadFields: async () => {
      const { client } = get()
      const { items } = await client.fieldList()
      const tables: string[] = []
      for (const item of items) {
        if (tables.indexOf(item.tableName) < 0) {
          tables.push(item.tableName)
        }
      }
      set({ fields: items })
      set({ tables: tables })
    },
    makeQuery: async () => {
      const { client, view } = get()
      if (!view) return
      const parser = new Parser()
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
        const { table } = await client.tableQuery({ query: view.query })
        set({ table })
        set({ viewError: undefined })
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
