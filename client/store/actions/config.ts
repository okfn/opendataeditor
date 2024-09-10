import * as store from '../store'
import * as types from '@client/types'
import { client } from '@client/client'

export async function loadConfig(throwError?: boolean) {
  const result = await client.configRead()

  if (result instanceof client.Error) {
    if (throwError) throw new Error(result.detail)
    return store.setState('load-config-error', (state) => {
      state.error = result
    })
  }

  store.setState('load-config', (state) => {
    state.config = result.config
  })
}

export async function saveConfig(config: types.IConfig) {
  const result = await client.configWrite({ config })

  if (result instanceof client.Error) {
    return store.setState('save-config-error', (state) => {
      state.error = result
    })
  }

  await loadConfig()
}

export function setHideWelcomeScreen(hideWelcomeScreen: boolean) {
  store.setState('hide-welcome-screen', (state) => {
    state.hideWelcomeScreen = hideWelcomeScreen
  })
}

export function setHideOpenLocationDialog(hideOpenLocationDialog: boolean) {
  store.setState('hide-open-location-dialog', (state) => {
    state.hideOpenLocationDialog = hideOpenLocationDialog
  })
}
