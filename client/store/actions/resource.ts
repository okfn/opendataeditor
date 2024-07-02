import * as store from '../store'
import { cloneDeep } from 'lodash'
import isEqual from 'fast-deep-equal'

export const getIsResourceUpdated = store.createSelector((state) => {
  return !isEqual(state.resource, state.record?.resource)
})

export function revertResource() {
  const state = store.getState()
  if (getIsResourceUpdated(state)) {
    store.setState('revert-resource', (state) => {
      state.resource = cloneDeep(state.record?.resource)
    })
  }
}
