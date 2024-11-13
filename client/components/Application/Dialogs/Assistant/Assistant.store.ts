// import { client } from '@client/client'
import * as helpers from '@client/helpers'
import * as appStore from '@client/store'

// We use component level state because dialog state
// needs to be shared between multiple components
// but it is not needed in the global state
class State {
  progress?: IProgress
  isTermsAccepted?: boolean
  openaiApiKey?: string
  prompt?: string
  result?: string

  get step() {
    if (this.prompt) return 'result'
    if (this.openaiApiKey) return 'prompt'
    if (this.isTermsAccepted) return 'creds'
    return 'terms'
  }
}

type IProgress = {
  type: 'generating' | 'error'
  message?: string
  blocking?: boolean
}

export const { state, useState, resetState } = helpers.createState(
  'AssistantDialog',
  new State()
)

export function closeDialog() {
  if (!state.progress?.blocking) {
    appStore.closeDialog()
    resetState()
  }
}

export function acceptTerms() {
  state.isTermsAccepted = true
}

export function setApiKey(props: { key: string }) {
  state.openaiApiKey = props.key
}

export async function setPromptAndLoadResult(props: { prompt: string }) {
  state.prompt = props.prompt

  state.progress = {
    type: 'generating',
    message: 'AI assistant is generating the response.',
    blocking: true,
  }
}
