import * as React from 'react'
import * as zustand from 'zustand'
import create from 'zustand/vanilla'
import { assert } from 'ts-essentials'
import noop from 'lodash/noop'
import cloneDeep from 'lodash/cloneDeep'
import { createSelector } from 'reselect'
import { SchemaProps } from './Schema'
import { ISchema } from '../../../interfaces'

const INITIAL_SCHEMA: ISchema = { fields: [] }

interface IElementInfo {
  query?: string
  index?: number
  isGrid?: boolean
  isExtra?: boolean
}

interface State {
  schema: ISchema
  onChange: (schema: ISchema) => void
  onFieldSelected: (name: string) => void
  updateSchema: (schema: ISchema) => void

  // Fields

  fieldInfo: IElementInfo
  updateFieldInfo: (fieldInfo: IElementInfo) => void

  // Foreign Keys

  foreignKeyInfo: IElementInfo
  updateForeignKeyInfo: (foreignKeyInfo: IElementInfo) => void
}

export function createStore(props: SchemaProps) {
  return create<State>((set, _get) => ({
    schema: cloneDeep(props.schema || INITIAL_SCHEMA),
    onChange: props.onChange || noop,
    onFieldSelected: props.onFieldSelected || noop,
    updateSchema: (schema) => set({ schema }),

    // Fields

    fieldInfo: {},
    updateFieldInfo: (fieldInfo) => set({ fieldInfo }),

    // Foreign Keys

    foreignKeyInfo: {},
    updateForeignKeyInfo: (foreignKeyInfo) => set({ foreignKeyInfo }),
  }))
}

export const select = createSelector
export const selectors = {
  // Fields

  field: (state: State) => {
    const index = state.fieldInfo.index
    assert(index !== undefined)
    const field = state.schema.fields[index]
    assert(field !== undefined)
    return field
  },
  fieldNames: (state: State) => {
    return state.schema.fields.map((field) => field.name)
  },
  foundFieldItems: (state: State) => {
    const items = []
    const query = state.fieldInfo.query
    for (const [index, field] of state.schema.fields.entries()) {
      if (query && !field.name.includes(query)) continue
      items.push({ index, field })
    }
    return items
  },

  // Foreign Keys

  foreignKey: (state: State) => {
    const index = state.foreignKeyInfo.index
    assert(index !== undefined)
    assert(state.schema.foreignKeys !== undefined)
    const foreignKey = state.schema.foreignKeys[index]
    assert(foreignKey !== undefined)
    return foreignKey
  },
  foreignKeyNames: (state: State) => {
    return (state.schema.foreignKeys || []).map((fk) => fk.fields.join(','))
  },
  foundForeignKeyItems: (state: State) => {
    const items = []
    const query = state.foreignKeyInfo.query
    for (const [index, fk] of (state.schema.foreignKeys || []).entries()) {
      const name = fk.fields.join(',')
      if (query && !name.includes(query)) continue
      items.push({ index, foreignKey: fk })
    }
    return items
  },
}

export function useStore<R>(selector: (state: State) => R): R {
  const store = React.useContext(StoreContext)
  assert(store, 'store provider is required')
  return zustand.useStore(store, selector)
}

const StoreContext = React.createContext<zustand.StoreApi<State> | null>(null)
export const StoreProvider = StoreContext.Provider
