import InputDialog from '../../Parts/Dialogs/Input'
import * as store from '@client/store'
import { useTranslation } from 'react-i18next'

export default function AddEmptyFolderDialog() {
  const folderPath = store.useStore(store.getFolderPath)

  const { t } = useTranslation()

  return (
    <InputDialog
      open={true}
      value={folderPath}
      title={t('create-new-folder')}
      label={t('create')}
      placholder={t('name-new-folder')}
      onCancel={store.closeDialog}
      onConfirm={async (path) => {
        await store.createFolder(path)
        store.closeDialog()
      }}
    />
  )
}
