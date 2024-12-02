import InputDialog from '@client/components/Parts/Dialogs/Input'
import { LinearProgress } from '@client/components/Progress'
import * as appStore from '@client/store'
import * as React from 'react'
import * as store from './store'
import { useTranslation } from 'react-i18next'

export function CreateFolderDialog() {
  const folderPath = appStore.useStore(appStore.getFolderPath)
  const dialog = appStore.useStore((state) => state.dialog)
  const { progress } = store.useState()

  React.useEffect(() => {
    store.resetState()
  }, [dialog])

  const { t } = useTranslation()

  return (
    <InputDialog
      open={true}
      value={folderPath}
      title={t('create-new-folder')}
      label={t('create')}
      placholder={t('name-new-folder')}
      onCancel={store.closeDialog}
      onConfirm={store.createFolder}
    >
      <LinearProgress progress={progress} />
    </InputDialog>
  )
}
