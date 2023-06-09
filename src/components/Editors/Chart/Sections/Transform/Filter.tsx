import * as React from 'react'
import Box from '@mui/material/Box'
import Columns from '../../../../Parts/Columns'
import { useStore } from '../../store'
import FieldPredicate from './Filter/FieldPredicate'
import ParamPredicate from './Filter/ParamPredicate'
import VegaExpression from './Filter/VegaExpression'
import SelectField from '../../../../Parts/Fields/Select'
import * as settings from '../../settings'

const FILTERS: { [key: string]: any } = {
  fieldpredicate: FieldPredicate,
  parampredicate: ParamPredicate,
  vegaexpression: VegaExpression,
}

export default function Filter() {
  const type = useStore((state) => state.filterState.type ?? 'fieldpredicate')
  const ViewFilter = FILTERS[type]
  return (
    <React.Fragment>
      <Columns>
        <Box>
          <Type />
        </Box>
      </Columns>
      <Columns>
        <Box>
          <ViewFilter />
        </Box>
      </Columns>
    </React.Fragment>
  )
}

function Type() {
  const type = useStore((state) => state.filterState.type!)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateFilterType = useStore((state) => state.updateFilterType)
  return (
    <SelectField
      label="Type"
      value={type ?? 'fieldpredicate'}
      options={settings.FILTER_TYPES}
      onFocus={() => updateHelp('transforms/filterType')}
      onChange={(value) => (value ? updateFilterType(value) : undefined)}
    />
  )
}
