import * as React from 'react'
import * as zustand from 'zustand'
import create from 'zustand/vanilla'
import { Parser, AST, Select } from 'node-sql-parser'
import { assert } from 'ts-essentials'
import { ViewProps } from './View'
import {
  IView,
  ITreeItem,
  IViewError,
  IFieldItem,
  ViewErrorLocation
} from '../../../interfaces'
import * as helpers from './helpers'

export interface State {
  view: IView
  fieldTree?: ITreeItem[]
  fields?: IFieldItem[]
  tables?: string[]

  // General
  viewError?: IViewError | undefined
  setQuery: (query: string) => void
  formatQuery: () => Promise<void>
  validateQuery: () => Promise<void>
}

export interface ExceptionError {
  message: string
}

export function createStore(props: ViewProps) {
  return create<State>((set, _get) => ({
    view: props.view || { query: '' },
    fieldTree: props.fields ? helpers.createTreeFromFields(props.fields) : undefined,
    viewError: props.viewError,
    fields: props.fields ? props.fields : undefined,
    tables: props.fields ? getTableNames(props.fields) : [],

    // General

    setQuery: (query) => {
      const view = { query }
      set({ view })
      if (props.onViewChange) props.onViewChange(view)
    },

    validateQuery: async () => {
      const { view } = _get()
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
        const { tables } = _get()
        const { fields } = _get()

        const errors = checkExistingTablesAndFields(parsedSQL, tables, fields)
        if (errors.length > 0) {
          const errorObj: IViewError = {
            message: errors.join(' '),
            location: ViewErrorLocation.Frontend,
          }
          set({ viewError: errorObj })
        }
      }
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
        set({ view: { query: parser.sqlify(parsedSQL) } })
      }
    },
  }))
}

function getTableNames(fieldTree: IFieldItem[]): string[] {
  const tables: string[] = []
  for (const item of fieldTree) {
    if (tables.indexOf(item.tableName) < 0) {
      tables.push(item.tableName)
    }
  }
  return tables
}

const checkExistingTablesAndFields = (
  sqlAST: AST | AST[],
  tables: string[] | undefined,
  fields: IFieldItem[] | undefined
) => {
  const errors: string[] = []
  const select: Select = sqlAST as Select

  if (select !== null && select.from) {
    for (const t of select.from) {
      if (tables && tables.indexOf(t.table) < 0) {
        errors.push(`Table "${t.table}" does nos exist.`)
      }
    }

    if (select.columns) {
      for (const c of select.columns) {
        if (c.expr && c.expr.column) {
          const column = c.expr.column
          if (fields && fields.findIndex((f) => f.name === column) < 0) {
            errors.push(`Field "${c.expr.column}" does nos exist.`)
          }
        }
      }
    }
  }

  return errors
}

export function useStore<R>(selector: (state: State) => R): R {
  const store = React.useContext(StoreContext)
  assert(store, 'store provider is required')
  return zustand.useStore(store, selector)
}

const StoreContext = React.createContext<zustand.StoreApi<State> | null>(null)
export const StoreProvider = StoreContext.Provider
