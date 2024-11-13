// import { client } from '@client/client'
import * as helpers from '@client/helpers'
import * as appStore from '@client/store'

// We use component level state because dialog state
// needs to be shared between multiple components
// but it is not needed in the global state
class State {
  isTermsAccepted?: boolean
  openaiApiKey?: string
}

export const { state, useState } = helpers.createState('Assistant', new State())

export function closeDialog() {
  appStore.closeDialog()
}

export async function nextStep() {
  if (!state.isTermsAccepted) {
    state.isTermsAccepted = true
  }
}
