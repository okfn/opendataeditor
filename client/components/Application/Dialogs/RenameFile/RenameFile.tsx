import InputDialog from '@client/components/Parts/Dialogs/Input'
import { LinearProgress } from '@client/components/Progress'
import * as appStore from '@client/store'
import * as React from 'react'
import * as store from './store'
import { useTranslation } from 'react-i18next'

export function RenameFileDialog() {
  const isFolder = appStore.useStore(appStore.getIsFolder)
  const dialog = appStore.useStore((state) => state.dialog)
  const { progress } = store.useState()

  React.useEffect(() => {
    store.resetState()
  }, [dialog])

  const { t } = useTranslation()
  const fileOrFolder = isFolder ? t('folder') : t('file')

  return (
    <InputDialog
      open={true}
      value=""
      title={t('rename-filefolder', { fileOrFolder })}
      label={t('save')}
      placholder={t('name-new-filefolder', { fileOrFolder })}
      onCancel={store.closeDialog}
      onConfirm={store.renameFile}
    >
      <LinearProgress progress={progress} />
    </InputDialog>
  )
}
