import * as React from 'react'
import * as zustand from 'zustand'
import { assert } from 'ts-essentials'
import { createStore } from 'zustand/vanilla'
import { createSelector } from 'reselect'
import { TypeComputedProps } from '@inovua/reactdatagrid-community/types'
import { IError, IRow, ISchema, IReport } from '../../../interfaces'
import { ITableLoader, ITableChange } from '../../../interfaces'
import { createColumns } from './columns'
import { TableProps } from './index'
import * as helpers from '../../../helpers'

interface State {
  // Currently used only to rerender
  mode?: 'errors'
  height?: string
  source: IRow[] | ITableLoader
  schema: ISchema
  report?: IReport
  readOnly?: boolean
  onChange?: (change: ITableChange) => void
  onErrorClick?: (error: IError) => void
  columns: any[]
  gridRef?: React.MutableRefObject<TypeComputedProps | null>
  updateState: (patch: Partial<State>) => void

  // Editing

  editing?: boolean
  // TODO: find proper context type
  startEditing: (context: any) => void
  saveEditing: (context: any) => void
  stopEditing: (context: any) => void
}

export function makeStore(props: TableProps) {
  return createStore<State>((set, get) => ({
    ...props,
    columns: createColumns(props.schema, props.report, props.onErrorClick),
    updateState: (patch) => {
      set({ ...patch })
    },

    // Editing

    startEditing: () => {
      const { updateState } = get()
      updateState({ editing: true })
    },
    saveEditing: (context) => {
      const { gridRef, onChange } = get()
      const grid = gridRef?.current
      if (!onChange) return
      if (!grid) return

      const rowNumber = context.rowId
      const fieldName = context.columnId
      let value = context.value
      if (context.cellProps.type === 'number') value = parseInt(value)
      const change: ITableChange = { type: 'update-cell', rowNumber, fieldName, value }
      helpers.applyTablePatch({ changes: [change] }, grid.data)
      onChange(change)
    },
    stopEditing: () => {
      const { gridRef, updateState } = get()
      const grid = gridRef?.current
      if (!grid) return

      requestAnimationFrame(() => {
        updateState({ editing: false })
        grid.focus()
      })
    },
  }))
}

export const select = createSelector
export const selectors = {}

export function useStore<R>(selector: (state: State) => R): R {
  const store = React.useContext(StoreContext)
  assert(store, 'store provider is required')
  return zustand.useStore(store, selector)
}

const StoreContext = React.createContext<zustand.StoreApi<State> | null>(null)
export const StoreProvider = StoreContext.Provider
