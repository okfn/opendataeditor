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

interface ISchemaState {
  vtabIndex: number
}

interface ISectionState {
  query?: string
  index?: number
  isGrid?: boolean
  isExtras?: boolean
}

interface State {
  descriptor: ISchema
  onChange: (schema: ISchema) => void
  onFieldSelected: (name?: string) => void
  helpItem: IHelpItem
  updateHelp: (path: string) => void
  updateDescriptor: (patch: Partial<ISchema>) => void

  // Schema

  schemaState: ISchemaState
  updateSchemaState: (patch: Partial<ISchemaState>) => void

  // Fields

  fieldState: ISectionState
  updateFieldState: (patch: Partial<ISectionState>) => void
  updateField: (patch: Partial<IField>) => void
  removeField: (index: number) => void
  addField: () => void

  // Foreign Keys

  foreignKeyState: ISectionState
  updateForeignKeyState: (patch: Partial<ISectionState>) => void
  updateForeignKey: (patch: Partial<IForeignKey>) => void
  removeForeignKey: (index: number) => void
  addForeignKey: () => void
}

export function makeStore(props: SchemaProps) {
  return createStore<State>((set, get) => ({
    descriptor: props.schema || cloneDeep(INITIAL_SCHEMA),
    onChange: props.onChange || noop,
    onFieldSelected: props.onFieldSelected || noop,
    helpItem: DEFAULT_HELP_ITEM,
    updateHelp: (path) => {
      const helpItem = helpers.readHelpItem(help, path) || DEFAULT_HELP_ITEM
      set({ helpItem })
    },
    updateDescriptor: (patch) => {
      const { descriptor, onChange } = get()
      Object.assign(descriptor, patch)
      onChange(descriptor)
      set({ descriptor })
    },

    // Schema

    schemaState: { vtabIndex: 1 },
    updateSchemaState: (patch) => {
      const { schemaState } = get()
      set({ schemaState: { ...schemaState, ...patch } })
    },

    // Fields

    fieldState: {},
    updateFieldState: (patch) => {
      const { fieldState, descriptor, onFieldSelected } = get()
      set({ fieldState: { ...fieldState, ...patch } })
      if ('index' in patch) {
        const field =
          patch.index !== undefined ? descriptor.fields[patch.index] : undefined
        onFieldSelected(field ? field.name : undefined)
      }
    },
    updateField: (patch) => {
      const { descriptor, updateDescriptor, fieldState } = get()
      const index = fieldState.index!
      const field = selectors.field(get())
      const fields = descriptor.fields
      fields[index] = { ...field, ...patch }
      updateDescriptor({ fields })
    },
    removeField: (index) => {
      const { descriptor, updateDescriptor, updateFieldState } = get()
      const fields = [...descriptor.fields]
      fields.splice(index, 1)
      updateFieldState({ index: undefined, isExtras: false })
      updateDescriptor({ fields })
    },
    // TODO: scroll to newly created field
    addField: () => {
      const { descriptor, updateDescriptor } = get()
      const fields = [...descriptor.fields]
      // TODO: deduplicate
      const name = `field${fields.length}`
      fields.push({ name, type: 'string' })
      updateDescriptor({ fields })
    },

    // Foreign Keys

    foreignKeyState: {},
    updateForeignKeyState: (patch) => {
      const { foreignKeyState } = get()
      set({ foreignKeyState: { ...foreignKeyState, ...patch } })
    },
    updateForeignKey: (patch) => {
      const { descriptor, foreignKeyState, updateDescriptor } = get()
      const index = foreignKeyState.index!
      const foreignKey = selectors.foreignKey(get())
      const foreignKeys = descriptor.foreignKeys!
      foreignKeys[index] = { ...foreignKey, ...patch }
      updateDescriptor({ foreignKeys })
    },
    removeForeignKey: (index) => {
      const { descriptor, updateDescriptor, updateForeignKeyState } = get()
      const foreignKeys = [...(descriptor.foreignKeys || [])]
      foreignKeys.splice(index, 1)
      updateForeignKeyState({ index: undefined, isExtras: false })
      updateDescriptor({ foreignKeys })
    },
    // TODO: scroll to newly created field
    addForeignKey: () => {
      const { descriptor, updateDescriptor } = get()
      const foreignKeys = [...(descriptor.foreignKeys || [])]
      // TODO: catch no fields
      const name = descriptor.fields[0].name
      foreignKeys.push({
        fields: [name],
        reference: { fields: [name], resource: '' },
      })
      updateDescriptor({ foreignKeys })
    },
  }))
}

export const select = createSelector
export const selectors = {
  // Fields

  field: (state: State) => {
    const index = state.fieldState.index!
    const field = state.descriptor.fields[index]!
    return field
  },
  fieldItems: (state: State) => {
    const items = []
    const query = state.fieldState.query
    for (const [index, field] of state.descriptor.fields.entries()) {
      if (query && !field.name.toLowerCase().includes(query.toLowerCase())) continue
      items.push({ index, field })
    }
    return items
  },
  fieldNames: (state: State) => {
    return state.descriptor.fields.map((field) => field.name)
  },

  // Foreign Keys

  foreignKey: (state: State) => {
    const index = state.foreignKeyState.index!
    const foreignKeys = state.descriptor.foreignKeys!
    const foreignKey = foreignKeys[index]!
    return foreignKey
  },
  foreignKeyItems: (state: State) => {
    const items = []
    const query = state.foreignKeyState.query
    for (const [index, fk] of (state.descriptor.foreignKeys || []).entries()) {
      const name = fk.fields.join(',')
      if (query && !name.toLowerCase().includes(query.toLowerCase())) continue
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
