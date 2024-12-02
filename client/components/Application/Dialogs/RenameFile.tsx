import InputDialog from '../../Parts/Dialogs/Input'
import * as store from '@client/store'
import { useTranslation } from 'react-i18next'

export default function RenameFileDialog() {
  const currentFilePath = store.useStore((state) => state.path)

  const isFolder = store.useStore(store.getIsFolder)

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
      onConfirm={async (newPath) => {
        if (currentFilePath)
          if (!isFolder) {
            await store.renameFile(currentFilePath, newPath)
          } else {
            await store.renameFolder(currentFilePath, newPath)
          }
        store.closeDialog()
      }}
    />
  )
}
