import * as store from '../store'

export function closeError() {
  store.setState('remove-error', (state) => {
    state.error = undefined
  })
}
