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
    <EditorSection name="Csv" onHeadingClick={() => updateHelp('dialect/csv')}>
      <Columns spacing={3}>
        <Box>
          <Delimiter />
          <QuoteChar />
          <DoubleQuote />
        </Box>
        <Box>
          <EscapeChar />
          <NullSequence />
          <SkipInitialSpace />
        </Box>
      </Columns>
    </EditorSection>
  )
}

function Delimiter() {
  const delimiter = useStore(select(selectors.csv, (csv) => csv.delimiter))
  const updateCsv = useStore((state) => state.updateCsv)
  return (
    <InputField
      label="Delimiter"
      value={delimiter || settings.DEFAULT_DELIMITER}
      onChange={(delimiter) => updateCsv({ delimiter })}
    />
  )
}

function QuoteChar() {
  const quoteChar = useStore(select(selectors.csv, (csv) => csv.quoteChar))
  const updateCsv = useStore((state) => state.updateCsv)
  return (
    <InputField
      label="Quote Char"
      value={quoteChar || settings.DEFAULT_QUOTE_CHAR}
      onChange={(quoteChar) => updateCsv({ quoteChar })}
    />
  )
}

function DoubleQuote() {
  const doubleQuote = useStore(select(selectors.csv, (csv) => csv.doubleQuote))
  const updateCsv = useStore((state) => state.updateCsv)
  return (
    <YesNoField
      label="Double Quote"
      value={doubleQuote || settings.DEFAULT_DOUBLE_QUOTE}
      onChange={(doubleQuote) => updateCsv({ doubleQuote })}
    />
  )
}

function EscapeChar() {
  const escapeChar = useStore(select(selectors.csv, (csv) => csv.escapeChar))
  const updateCsv = useStore((state) => state.updateCsv)
  return (
    <InputField
      label="Escape Char"
      value={escapeChar || settings.DEFAULT_ESCAPE_CHAR}
      onChange={(escapeChar) => updateCsv({ escapeChar })}
    />
  )
}

function NullSequence() {
  const nullSequence = useStore(select(selectors.csv, (csv) => csv.nullSequence))
  const updateCsv = useStore((state) => state.updateCsv)
  return (
    <InputField
      label="Null Sequence"
      value={nullSequence || settings.DEFAULT_NULL_SEQUENCE}
      onChange={(nullSequence) => updateCsv({ nullSequence })}
    />
  )
}

function SkipInitialSpace() {
  const skipInitialSpace = useStore(select(selectors.csv, (csv) => csv.skipInitialSpace))
  const updateCsv = useStore((state) => state.updateCsv)
  return (
    <YesNoField
      label="Skip Initial Space"
      value={skipInitialSpace || settings.DEFAULT_SKIP_INITIAL_SPACE}
      onChange={(skipInitialSpace) => updateCsv({ skipInitialSpace })}
    />
  )
}
