import * as store from '../store'
import { cloneDeep } from 'lodash'
import isEqual from 'fast-deep-equal'
import * as types from '@client/types'

export const getIsResourceUpdated = store.createSelector((state) => {
  return !isEqual(state.resource, state.record?.resource)
})

export function updateResource(resource: types.IResource) {
  store.setState('update-resource', (state) => {
    state.resource = resource
  })
}

export function revertResource() {
  const state = store.getState()
  if (getIsResourceUpdated(state)) {
    store.setState('revert-resource', (state) => {
      state.resource = cloneDeep(state.record?.resource)
    })
  }
}
