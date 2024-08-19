import * as store from '../store'
import isEqual from 'fast-deep-equal'
import { cloneDeep } from 'lodash'
import * as types from '@client/types'

export function updateResource(resource: types.IResource) {
  store.setState('update-resource', (state) => {
    state.resource = resource
    state.isResourceUpdated = !isEqual(state.record?.resource, resource)
  })
}

export function revertResource() {
  const state = store.getState()
  if (state.isResourceUpdated) {
    store.setState('revert-resource', (state) => {
      state.resource = cloneDeep(state.record?.resource)
      state.isResourceUpdated = false
    })
  }
}
