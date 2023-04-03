import * as React from 'react'
import Box from '@mui/material/Box'
import Columns from '../../../Parts/Columns'
import InputField from '../../../Parts/Fields/InputField'
import YesNoField from '../../../Parts/Fields/YesNoField'
import EditorSection from '../../../Parts/Editor/EditorSection'
import * as settings from '../../../../settings'
import { useStore, selectors, select } from '../store'

export default function General() {
  const updateHelp = useStore((state) => state.updateHelp)
  return (
    <EditorSection name="Excel" onHeadingClick={() => updateHelp('excel')}>
      <Columns spacing={3}>
        <Box>
          <Sheet />
          <WorkBookCache />
          <FillMergedCells />
        </Box>
        <Box>
          <PreserveFormatting />
          <AdjustFloatingPointError />
          <Stringified />
        </Box>
      </Columns>
    </EditorSection>
  )
}

function Sheet() {
  const sheet = useStore(select(selectors.excel, (excel) => excel.sheet))
  const updateHelp = useStore((state) => state.updateHelp)
  const updateExcel = useStore((state) => state.updateExcel)
  return (
    <InputField
      label="Sheet"
      value={sheet || settings.DEFAULT_SHEET}
      onFocus={() => updateHelp('excel/sheet')}
      onChange={(sheet) => updateExcel({ sheet })}
    />
  )
}

function WorkBookCache() {
  const workBookCache = useStore(
    select(selectors.excel, (excel) => excel.workBookCache || '')
  )
  const updateHelp = useStore((state) => state.updateHelp)
  const updateExcel = useStore((state) => state.updateExcel)
  return (
    <InputField
      label="Workbook Cache"
      value={workBookCache}
      onFocus={() => updateHelp('excel/workBookCache')}
      onChange={(workBookCache) => updateExcel({ workBookCache })}
    />
  )
}

function FillMergedCells() {
  const fillMergedCells = useStore(
    select(selectors.excel, (excel) => excel.fillMergedCells)
  )
  const updateHelp = useStore((state) => state.updateHelp)
  const updateExcel = useStore((state) => state.updateExcel)
  return (
    <YesNoField
      label="Fill Merged Cells"
      value={fillMergedCells || settings.DEFAULT_FILLED_MERGED_CELLS}
      onFocus={() => updateHelp('excel/fillMergedCells')}
      onChange={(fillMergedCells) => updateExcel({ fillMergedCells })}
    />
  )
}

function PreserveFormatting() {
  const preserveFormatting = useStore(
    select(selectors.excel, (excel) => excel.preserveFormatting)
  )
  const updateHelp = useStore((state) => state.updateHelp)
  const updateExcel = useStore((state) => state.updateExcel)
  return (
    <YesNoField
      label="Preserve Formatting"
      value={preserveFormatting || settings.DEFAULT_PRESERVE_FORMATTING}
      onFocus={() => updateHelp('excel/preserveFormatting')}
      onChange={(preserveFormatting) => updateExcel({ preserveFormatting })}
    />
  )
}

function AdjustFloatingPointError() {
  const adjustFloatingPointError = useStore(
    select(selectors.excel, (excel) => excel.adjustFloatingPointError)
  )
  const updateHelp = useStore((state) => state.updateHelp)
  const updateExcel = useStore((state) => state.updateExcel)
  return (
    <YesNoField
      label="Adjust Floating Point Error"
      value={adjustFloatingPointError || false}
      onFocus={() => updateHelp('excel/adjustFloatingPointError')}
      onChange={(adjustFloatingPointError) => updateExcel({ adjustFloatingPointError })}
    />
  )
}

function Stringified() {
  const stringified = useStore(select(selectors.excel, (excel) => excel.stringified))
  const updateHelp = useStore((state) => state.updateHelp)
  const updateExcel = useStore((state) => state.updateExcel)
  return (
    <YesNoField
      label="Stringified"
      value={stringified || settings.DEFAULT_STRINGIFIED}
      onFocus={() => updateHelp('excel/stringified')}
      onChange={(stringified) => updateExcel({ stringified })}
    />
  )
}
