import * as React from 'react'
import * as zustand from 'zustand'
import { assert } from 'ts-essentials'
import noop from 'lodash/noop'
import cloneDeep from 'lodash/cloneDeep'
import { createStore } from 'zustand/vanilla'
import { createSelector } from 'reselect'
import { ISchema, IField, IForeignKey, IHelpItem } from '../../../interfaces'
import { SchemaProps } from './Schema'
import * as helpers from '../../../helpers'
import help from './help.yaml'

const INITIAL_SCHEMA: ISchema = { fields: [] }
const DEFAULT_HELP_ITEM = helpers.readHelpItem(help, 'schema')!

interface ISectionState {
  query?: string
  index?: number
  isGrid?: boolean
  isExtras?: boolean
}

interface State {
  schema: ISchema
  onChange: (schema: ISchema) => void
  onFieldSelected: (name?: string) => void
  helpItem: IHelpItem
  updateHelp: (path: string) => void

  // Schema

  updateSchema: (patch: Partial<ISchema>) => void

  // Fields

  fieldState: ISectionState
  updateFieldState: (patch: Partial<ISectionState>) => void
  updateField: (patch: Partial<IField>) => void
  removeField: () => void
  addField: () => void

  // Foreign Keys

  foreignKeyState: ISectionState
  updateForeignKeyState: (patch: Partial<ISectionState>) => void
  updateForeignKey: (patch: Partial<IForeignKey>) => void
  removeForeignKey: () => void
  addForeignKey: () => void
}

export function makeStore(props: SchemaProps) {
  return createStore<State>((set, get) => ({
    schema: cloneDeep(props.schema || INITIAL_SCHEMA),
    onChange: props.onChange || noop,
    onFieldSelected: props.onFieldSelected || noop,
    helpItem: DEFAULT_HELP_ITEM,
    updateHelp: (path) => {
      const helpItem = helpers.readHelpItem(help, path) || DEFAULT_HELP_ITEM
      set({ helpItem })
    },

    // Schema

    updateSchema: (patch) => {
      let { schema, onChange } = get()
      schema = { ...schema, ...patch }
      onChange(schema)
      set({ schema })
    },

    // Fields

    fieldState: {},
    updateFieldState: (patch) => {
      const { fieldState, schema, onFieldSelected } = get()
      set({ fieldState: { ...fieldState, ...patch } })
      if ('index' in patch) {
        const field = patch.index !== undefined ? schema.fields[patch.index] : undefined
        onFieldSelected(field ? field.name : undefined)
      }
    },
    updateField: (patch) => {
      const { schema, updateSchema } = get()
      const { index, field } = selectors.field(get())
      const fields = schema.fields
      fields[index] = { ...field, ...patch }
      updateSchema({ fields })
    },
    removeField: () => {
      const { schema, updateSchema, updateFieldState } = get()
      const { index } = selectors.field(get())
      const fields = [...schema.fields]
      fields.splice(index, 1)
      updateFieldState({ index: undefined, isExtras: false })
      updateSchema({ fields })
    },
    // TODO: scroll to newly created field
    addField: () => {
      const { schema, updateSchema } = get()
      const fields = [...schema.fields]
      // TODO: deduplicate
      const name = `field${fields.length}`
      fields.push({ name, type: 'string' })
      updateSchema({ fields })
    },

    // Foreign Keys

    foreignKeyState: {},
    updateForeignKeyState: (patch) => {
      const { foreignKeyState } = get()
      set({ foreignKeyState: { ...foreignKeyState, ...patch } })
    },
    updateForeignKey: (patch) => {
      const { schema, updateSchema } = get()
      const { index, foreignKey } = selectors.foreignKey(get())
      const foreignKeys = schema.foreignKeys!
      foreignKeys[index] = { ...foreignKey, ...patch }
      updateSchema({ foreignKeys })
    },
    removeForeignKey: () => {
      const { schema, updateSchema, updateForeignKeyState } = get()
      const { index } = selectors.foreignKey(get())
      const foreignKeys = [...(schema.foreignKeys || [])]
      foreignKeys.splice(index, 1)
      updateForeignKeyState({ index: undefined, isExtras: false })
      updateSchema({ foreignKeys })
    },
    // TODO: scroll to newly created field
    addForeignKey: () => {
      const { schema, updateSchema } = get()
      const foreignKeys = [...(schema.foreignKeys || [])]
      // TODO: catch no fields
      const name = schema.fields[0].name
      foreignKeys.push({
        fields: [name],
        reference: { fields: [name], resource: '' },
      })
      updateSchema({ foreignKeys })
    },
  }))
}

export const select = createSelector
export const selectors = {
  // Fields

  field: (state: State) => {
    const index = state.fieldState.index!
    const field = state.schema.fields[index]!
    return { index, field }
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
    const index = state.foreignKeyState.index!
    const foreignKeys = state.schema.foreignKeys!
    const foreignKey = foreignKeys[index]!
    return { index, foreignKey }
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
