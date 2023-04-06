import * as React from 'react'
import * as zustand from 'zustand'
import cloneDeep from 'lodash/cloneDeep'
import { createStore } from 'zustand/vanilla'
import { createSelector } from 'reselect'
import { assert } from 'ts-essentials'
import { Client } from '../../../client'
import { IFile, IPackage } from '../../../interfaces'
import { PackageProps } from './Package'
import * as helpers from '../../../helpers'

export interface State {
  file: IFile
  client: Client
  panel?: 'preview'
  dialog?: 'saveAs' | 'resource'
  original?: IPackage
  modified?: IPackage
  revision: number
  updateState: (patch: Partial<State>) => void
  load: () => Promise<void>
  clear: () => void
  revert: () => void
  save: (path?: string) => Promise<void>

  // Resources
  addResources: (paths: string[]) => Promise<void>
}

export function makeStore(props: PackageProps) {
  return createStore<State>((set, get) => ({
    ...props,
    revision: 0,
    updateState: (patch) => {
      const { revision } = get()
      if ('modified' in patch) patch.revision = revision + 1
      if ('resource' in patch) patch.revision = revision + 1
      set(patch)
    },
    load: async () => {
      const { client, file } = get()
      const { data } = await client.jsonRead({ path: file.path })
      set({ modified: cloneDeep(data), original: data })
    },
    clear: () => {
      const { updateState } = get()
      const descriptor = helpers.getInitialDescriptor('package') as IPackage
      if (!descriptor) return
      updateState({ modified: cloneDeep(descriptor) })
    },
    revert: () => {
      const { original } = get()
      set({ modified: cloneDeep(original), revision: 0 })
    },
    save: async (path) => {
      const { file, client, modified } = get()
      console.log(modified)
      await client.jsonWrite({ path: path || file.path, data: modified })
      set({ modified: cloneDeep(modified), original: modified, revision: 0 })
    },

    // Resources

    addResources: async (paths) => {
      const { client, modified, updateState } = get()
      if (!modified) return
      const resources = [...modified.resources]
      for (const path of paths) {
        const { file } = await client.fileSelect({ path })
        if (file?.record) {
          resources.push(file.record.resource)
        }
      }
      updateState({ modified: { ...modified, resources } })
    },
  }))
}

export const select = createSelector
export const selectors = {
  isUpdated: (state: State) => {
    return state.revision > 0
  },
}

export function useStore<R>(selector: (state: State) => R): R {
  const store = React.useContext(StoreContext)
  assert(store, 'store provider is required')
  return zustand.useStore(store, selector)
}

const StoreContext = React.createContext<zustand.StoreApi<State> | null>(null)
export const StoreProvider = StoreContext.Provider
