import { client } from '@client/client'
import { redoTableChange, togglePanel, undoTableChange } from '@client/store'
import delay from 'delay'
import * as store from '../store'
import { loadConfig } from './config'
import { openDialog } from './dialog'
import { getIsFileOrResourceUpdated, loadFiles } from './file'

export async function onAppStart() {
  // @ts-ignore
  const bridge = window?.opendataeditor
  const sendFatalError = bridge?.sendFatalError

  let ready = false
  let attempt = 0
  const maxAttempts = sendFatalError ? 300 : 3
  const delaySeconds = 1

  // Note: it is not possible to use imperative code mutating state
  // inside React rendering functions (moved here from the Layout component)
  openDialog('welcomeBanner')

  while (!ready) {
    try {
      await loadConfig(true)
      await loadFiles(true)
      ready = true
    } catch (error) {
      attempt += 1
      if (attempt >= maxAttempts) {
        const serverUrl = client.serverUrl
        const message = `Client cannot connect to server on "${serverUrl}"`
        sendFatalError ? sendFatalError(message) : alert(message)
      }
      await delay(delaySeconds * 1000)
    }
  }

  // Setup project sync polling

  // Polling is disabled because now users can't manually change to project dir
  // setInterval(async () => {
  // const result = await client.projectSync({})

  // // Here we ignore errors for now and just update the files on success
  // if (result instanceof client.Error) {
  // return
  // }

  // // We update state only if there are changes to prevent unnecessary re-renders
  // // and simplify debugging in Redux Debugger
  // const state = store.getState()
  // if (!isEqual(state.files, result.files)) {
  // store.setState('sync-files', (state) => {
  // state.files = result.files
  // })
  // }
  // }, settings.PROJECT_SYNC_INTERVAL_MILLIS)

  // Register on windows close event handler (only Desktop env)
  // to prevent closing the app when there are unsaved changes

  if (bridge?.closeDesktopApp) {
    window.onbeforeunload = (event) => {
      const isUpdated = getIsFileOrResourceUpdated(store.getState())
      if (isUpdated) {
        event.preventDefault()
        openDialog('closeWithUnsavedChanges')
      }
    }
  }

  // Register menu events

  bridge?.onMenuAddNewFile(() => {
    openDialog('fileUpload', 0)
  })

  bridge?.onMenuAddExternalFile(() => {
    openDialog('fileUpload', 1)
  })

  bridge?.onDeleteFile(() => {
    openDialog('deleteFilesFolders')
  })

  bridge?.onPublishFile(() => {
    openDialog('publish')
  })

  bridge?.onToggleMetadata(() => {
    togglePanel('metadata')
  })

  bridge?.onToggleErrorsReport(() => {
    togglePanel('report')
  })

  bridge?.onToggleSource(() => {
    togglePanel('source')
  })

  bridge?.onUndo(() => {
    undoTableChange()
  })

  bridge?.onRedo(() => {
    redoTableChange()
  })
}

export function closeDesktopApp() {
  // @ts-ignore
  const bridge = window?.opendataeditor

  bridge?.closeDesktopApp()
}
