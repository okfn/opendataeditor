import TwoButtonDialog from '@client/components/Parts/Dialogs/TwoButton'
import * as appStore from '@client/store'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import SelectField from '../../../Parts/Fields/Select'
import { formats } from './constants'
import * as store from './store'
import { IFormat } from './types'

export function ExportDialog() {
  const { t } = useTranslation()
  const { format } = store.useState()
  const dialog = appStore.useStore((state) => state.dialog)

  React.useEffect(() => {
    store.resetState()
  }, [dialog])

  const handleChange = (value: string) => {
    store.setFormat(value as IFormat)
  }

  const options = formats.map((format) => {
    return { value: format.name, label: t(format.title) }
  })

  return (
    <TwoButtonDialog
      open={true}
      title={t('export')}
      label={t('export')}
      cancelLabel={t('cancel')}
      onCancel={store.closeDialog}
      onConfirm={store.closeDialog}
    >
      <Stack>
        <SelectField
          label={t('format')}
          value={format}
          options={options}
          onChange={(value) => handleChange(value)}
        />
        <Typography sx={{ fontStyle: 'italic' }}>
          {t('select-metadata-format')}.
        </Typography>
      </Stack>
    </TwoButtonDialog>
  )
}
