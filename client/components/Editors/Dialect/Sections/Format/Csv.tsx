import Box from '@mui/material/Box'
import Columns from '../../../../Parts/Grids/Columns'
import InputField from '../../../../Parts/Fields/Input'
import YesNoField from '../../../../Parts/Fields/YesNo'
import EditorSection from '../../../Base/Section'
import * as settings from '../../../../../settings'
import { useStore, selectors, select } from '../../store'

export default function General() {
  const updateHelp = useStore((state) => state.updateHelp)
  return (
    <EditorSection name="Csv" onHeadingClick={() => updateHelp('dialect/format')}>
      <Columns spacing={3}>
        <Box>
          <Delimiter />
          <QuoteChar />
          <DoubleQuote />
          <LineTerminator />
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
  const updateHelp = useStore((state) => state.updateHelp)
  const updateCsv = useStore((state) => state.updateCsv)
  return (
    <InputField
      label="Delimiter"
      value={delimiter || settings.DEFAULT_DELIMITER}
      onFocus={() => updateHelp('dialect/format/delimiter')}
      onChange={(delimiter) => updateCsv({ delimiter })}
    />
  )
}

function LineTerminator() {
  const lineTerminator = useStore(select(selectors.csv, (csv) => csv.lineTerminator))
  const updateHelp = useStore((state) => state.updateHelp)
  const updateCsv = useStore((state) => state.updateCsv)
  return (
    <InputField
      label="Line Terminator"
      value={lineTerminator || settings.DEFAULT_LINE_TERMINATOR}
      onFocus={() => updateHelp('dialect/format/lineTerminator')}
      onChange={(lineTerminator) => updateCsv({ lineTerminator })}
    />
  )
}

function QuoteChar() {
  const quoteChar = useStore(select(selectors.csv, (csv) => csv.quoteChar))
  const updateHelp = useStore((state) => state.updateHelp)
  const updateCsv = useStore((state) => state.updateCsv)
  return (
    <InputField
      label="Quote Char"
      value={quoteChar || settings.DEFAULT_QUOTE_CHAR}
      onFocus={() => updateHelp('dialect/format/quoteChar')}
      onChange={(quoteChar) => updateCsv({ quoteChar })}
    />
  )
}

function DoubleQuote() {
  const doubleQuote = useStore(select(selectors.csv, (csv) => csv.doubleQuote))
  const updateHelp = useStore((state) => state.updateHelp)
  const updateCsv = useStore((state) => state.updateCsv)
  return (
    <YesNoField
      label="Double Quote"
      value={doubleQuote ?? settings.DEFAULT_DOUBLE_QUOTE}
      onFocus={() => updateHelp('dialect/format/doubleQuote')}
      onChange={(doubleQuote) => updateCsv({ doubleQuote })}
    />
  )
}

function EscapeChar() {
  const escapeChar = useStore(select(selectors.csv, (csv) => csv.escapeChar))
  const updateHelp = useStore((state) => state.updateHelp)
  const updateCsv = useStore((state) => state.updateCsv)
  return (
    <InputField
      label="Escape Char"
      value={escapeChar || settings.DEFAULT_ESCAPE_CHAR}
      onFocus={() => updateHelp('dialect/format/escapeChar')}
      onChange={(escapeChar) => updateCsv({ escapeChar })}
    />
  )
}

function NullSequence() {
  const nullSequence = useStore(select(selectors.csv, (csv) => csv.nullSequence))
  const updateHelp = useStore((state) => state.updateHelp)
  const updateCsv = useStore((state) => state.updateCsv)
  return (
    <InputField
      label="Null Sequence"
      value={nullSequence || settings.DEFAULT_NULL_SEQUENCE}
      onFocus={() => updateHelp('dialect/format/nullSequence')}
      onChange={(nullSequence) => updateCsv({ nullSequence })}
    />
  )
}

function SkipInitialSpace() {
  const skipInitialSpace = useStore(select(selectors.csv, (csv) => csv.skipInitialSpace))
  const updateHelp = useStore((state) => state.updateHelp)
  const updateCsv = useStore((state) => state.updateCsv)
  return (
    <YesNoField
      label="Skip Initial Space"
      value={skipInitialSpace || settings.DEFAULT_SKIP_INITIAL_SPACE}
      onFocus={() => updateHelp('csv/skipInitialSpace')}
      onChange={(skipInitialSpace) => updateCsv({ skipInitialSpace })}
    />
  )
}
