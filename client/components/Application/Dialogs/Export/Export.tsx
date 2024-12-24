import TwoButtonDialog from '@client/components/Parts/Dialogs/TwoButton'
import * as appStore from '@client/store'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import * as store from './store'

export function ExportDialog() {
  const dialog = appStore.useStore((state) => state.dialog)

  React.useEffect(() => {
    store.resetState()
  }, [dialog])

  const { t } = useTranslation()

  return (
    <TwoButtonDialog
      open={true}
      title={t('export')}
      label={t('export')}
      cancelLabel={t('cancel')}
      onCancel={store.closeDialog}
      onConfirm={store.closeDialog}
    >
      <div>export</div>
    </TwoButtonDialog>
  )
}
