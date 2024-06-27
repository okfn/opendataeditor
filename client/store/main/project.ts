import { client } from '@client/client'
import * as store from '../store'
import { closeFile, loadFiles } from './file'
import { loadConfig } from './config'

export async function openProject(fullpath: string) {
  closeFile()

  store.setState('open-project-start', (state) => {
    state.main.loading = true
  })

  const result = await client.projectOpen({ fullpath })

  if (result instanceof client.Error) {
    return store.setState('open-project-error', (state) => {
      state.main.error = result
    })
  }

  await loadConfig()
  await loadFiles()

  store.setState('open-project-end', (state) => {
    state.main.loading = false
  })
}
