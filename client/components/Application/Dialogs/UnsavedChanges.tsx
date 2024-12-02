import DangerousIcon from '@mui/icons-material/Dangerous'
import TwoButtonDialog from '../../Parts/Dialogs/TwoButton'
import * as store from '@client/store'
import { useTranslation } from 'react-i18next'

export default function UnsavedChangesDialog() {
  const onSave = async () => {
    await store.saveFile()
    store.closeDialog()
  }

  const onDiscard = async () => {
    await store.revertFile()
    store.closeDialog()
  }

  const { t } = useTranslation()

  return (
    <TwoButtonDialog
      open={true}
      title={t('unsaved-changes')}
      cancelLabel={t('discard')}
      label={t('save')}
      Icon={DangerousIcon}
      description={t('unsaved-changes-dialog-description')}
      onCancel={onDiscard}
      onConfirm={onSave}
    />
  )
}
