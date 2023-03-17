import * as React from 'react'
import * as zustand from 'zustand'
import { assert } from 'ts-essentials'
import noop from 'lodash/noop'
import cloneDeep from 'lodash/cloneDeep'
import { createStore } from 'zustand/vanilla'
import { createSelector } from 'reselect'
import { SchemaProps } from './Schema'
import { ISchema } from '../../../interfaces'

const INITIAL_SCHEMA: ISchema = { fields: [] }

interface ISectionState {
  query?: string
  index?: number
  isGrid?: boolean
  isExtra?: boolean
}

interface State {
  schema: ISchema
  onChange: (schema: ISchema) => void
  onFieldSelected: (name: string) => void
  updateSchema: (patch: Partial<ISchema>) => void

  // Fields

  fieldState: ISectionState
  updateFieldState: (patch: Partial<ISectionState>) => void

  // Foreign Keys

  foreignKeyState: ISectionState
  updateForeignKeyState: (patch: Partial<ISectionState>) => void
}

export function makeStore(props: SchemaProps) {
  return createStore<State>((set, get) => ({
    schema: cloneDeep(props.schema || INITIAL_SCHEMA),
    onChange: props.onChange || noop,
    onFieldSelected: props.onFieldSelected || noop,
    updateSchema: (patch) => {
      let { schema, onChange } = get()
      schema = { ...schema, ...patch }
      onChange(schema)
      set({ schema })
    },

    // Fields

    fieldState: {},
    updateFieldState: (patch) => {
      const { fieldState } = get()
      set({ fieldState: { ...fieldState, ...patch } })
    },

    // Foreign Keys

    foreignKeyState: {},
    updateForeignKeyState: (patch) => {
      const { foreignKeyState } = get()
      set({ foreignKeyState: { ...foreignKeyState, ...patch } })
    },
  }))
}

export const select = createSelector
export const selectors = {
  // Fields

  field: (state: State) => {
    const index = state.fieldState.index
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
    const query = state.fieldState.query
    for (const [index, field] of state.schema.fields.entries()) {
      if (query && !field.name.includes(query)) continue
      items.push({ index, field })
    }
    return items
  },

  // Foreign Keys

  foreignKey: (state: State) => {
    const index = state.foreignKeyState.index
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
    const query = state.foreignKeyState.query
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
