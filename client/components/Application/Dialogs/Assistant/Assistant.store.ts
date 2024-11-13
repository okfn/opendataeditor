// import { client } from '@client/client'
import * as helpers from '@client/helpers'
import * as appStore from '@client/store'

// We use component level state because dialog state
// needs to be shared between multiple components
// but it is not needed in the global state
class State {
  isTermsAccepted?: boolean
  openaiApiKey?: string

  get step() {
    if (this.openaiApiKey) return 'prompt'
    if (this.isTermsAccepted) return 'creds'
    return 'terms'
  }
}

export const { state, useState } = helpers.createState('Assistant', new State())

export function resetState() {
  const initialState = new State()
  for (const key of Object.keys(state)) {
    // @ts-ignore
    state[key] = initialState[key]
  }
}

export function closeDialog() {
  appStore.closeDialog()
  resetState()
}

export function acceptTerms() {
  state.isTermsAccepted = true
}

export function setApiKey(props: { key: string }) {
  state.openaiApiKey = props.key
}
