import { client } from '@client/client'
import * as store from '../store'
import { deselectFile, loadFiles } from './file'
import { loadConfig } from './config'

export async function openProject(fullpath: string) {
  deselectFile()

  store.setState('open-project-start', (state) => {
    state.loading = true
  })

  const result = await client.projectOpen({ fullpath })

  if (result instanceof client.Error) {
    return store.setState('open-project-error', (state) => {
      state.error = result
    })
  }

  await loadConfig()
  await loadFiles()

  store.setState('open-project-end', (state) => {
    state.loading = false
  })
}
