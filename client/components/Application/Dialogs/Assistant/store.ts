import { client } from '@client/client'
import * as helpers from '@client/helpers'
import * as appStore from '@client/store'
import * as types from '@client/types'
import { t } from 'i18next'
import invariant from 'tiny-invariant'

// We use component level state because dialog state
// needs to be shared between multiple components
// but it is not needed in the global state
class State {
  progress?: types.IProgress
  isTermsAccepted?: boolean
  apiKey?: string
  prompt?: string
  result?: string

  get step() {
    if (this.prompt) return 'result'
    if (this.apiKey) return 'prompt'
    if (this.isTermsAccepted) return 'creds'
    return 'terms'
  }
}

export const { state, useState, resetState } = helpers.createState(
  'AssistantDialog',
  new State()
)

export function closeDialog() {
  if (!state.progress?.blocking) {
    appStore.closeDialog()
  }
}

export function acceptTerms() {
  state.isTermsAccepted = true
}

export function setApiKey(props: { key: string }) {
  state.apiKey = props.key
}

export async function setPromptAndFetchResult(props: { prompt: string }) {
  state.prompt = props.prompt

  state.progress = {
    type: 'generating',
    title: t('generating'),
    message: t('generating-response'),
    blocking: true,
  }

  const { path } = appStore.getState()
  const { prompt, apiKey } = state
  invariant(path, t('path-required'))
  invariant(prompt, t('prompt-required'))
  invariant(apiKey, t('api-required'))

  const result = await client.tableSuggest({ path, prompt, apiKey })
  if (result instanceof client.Error) {
    state.progress = {
      type: 'error',
      message: result.detail,
      blocking: false,
    }
    return
  }

  state.result = result.text
  state.progress = undefined
}
