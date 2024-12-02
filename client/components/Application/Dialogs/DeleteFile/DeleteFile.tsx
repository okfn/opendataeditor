import TwoButtonDialog from '@client/components/Parts/Dialogs/TwoButton'
import { LinearProgress } from '@client/components/Progress'
import * as appStore from '@client/store'
import * as React from 'react'
import * as store from './store'
import { useTranslation } from 'react-i18next'

export function DeleteFileDialog() {
  const isFolder = appStore.useStore(appStore.getIsFolder)
  const dialog = appStore.useStore((state) => state.dialog)
  const { progress } = store.useState()

  const { t } = useTranslation()
  const fileOrFolder = isFolder ? t('folder') : t('file')

  React.useEffect(() => {
    store.resetState()
  }, [dialog])

  const description = !progress
    ? t('are-you-sure-delete-filefolder', { fileOrFolder })
    : undefined

  return (
    <TwoButtonDialog
      open={true}
      title={t('delete-fileFolder', { fileOrFolder })}
      description={description}
      label={t('delete')}
      hoverBgButtonColor="OKFNRed600"
      cancelLabel={t('no')}
      onCancel={store.closeDialog}
      onConfirm={store.deleteFile}
    >
      <LinearProgress progress={progress} />
    </TwoButtonDialog>
  )
}
