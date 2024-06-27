import * as store from '../store'
import * as types from '@client/types'
import { client } from '@client/client'

export async function loadConfig(throwError?: boolean) {
  const result = await client.configRead()

  if (result instanceof client.Error) {
    if (throwError) throw new Error(result.detail)
    return store.setState('load-config-error', (state) => {
      state.main.error = result
    })
  }

  store.setState('load-config', (state) => {
    state.main.config = result.config
  })
}

export async function saveConfig(config: types.IConfig) {
  const result = await client.configWrite({ config })

  if (result instanceof client.Error) {
    return store.setState('save-config-error', (state) => {
      state.main.error = result
    })
  }

  await loadConfig()
}
