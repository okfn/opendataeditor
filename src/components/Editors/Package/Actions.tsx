import * as React from 'react'
import Box from '@mui/material/Box'
import ExportButton from '../../Library/Buttons/ExportButton'
import ImportButton from '../../Library/Buttons/ImportButton'
import CommitButton from '../../Library/Buttons/CommitButton'
import RevertButton from '../../Library/Buttons/RevertButton'
import Columns from '../../Library/Columns'
import * as settings from '../../../settings'
import { useStore } from './store'

export default function Actions() {
  const isPreview = useStore((state) => state.isPreview)
  const isUpdated = useStore((state) => state.isUpdated)
  const exportFormat = useStore((state) => state.exportFormat)
  const setExportFormat = useStore((state) => state.setExportFormat)
  const togglePreview = useStore((state) => state.togglePreview)
  const exporter = useStore((state) => state.exporter)
  const importer = useStore((state) => state.importer)
  const commit = useStore((state) => state.commit)
  const revert = useStore((state) => state.revert)
  return (
    <Box sx={{ borderTop: 'solid 1px #ddd', lineHeight: '63px' }}>
      <Columns>
        <ExportButton
          format={exportFormat}
          options={settings.METADATA_FORMATS}
          isPreview={isPreview}
          onExport={exporter}
          onPreview={togglePreview}
          setFormat={setExportFormat}
        />
        <ImportButton onImport={importer} />
        <CommitButton disabled={!isUpdated} onClick={commit} />
        <RevertButton disabled={!isUpdated} onClick={revert} />
      </Columns>
    </Box>
  )
}
