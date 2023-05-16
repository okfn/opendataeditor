import * as React from 'react'
import Box from '@mui/material/Box'
import Columns from '../../../../Parts/Columns'
import EditorItem from '../../../../Parts/Editor/Item'
import EditorList from '../../../../Parts/Editor/List'
import EditorListItem from '../../../../Parts/Editor/ListItem'
import EditorSearch from '../../../../Parts/Editor/Search'
import SelectField from '../../../../Parts/Fields/Select'
import { useStore, selectors, select } from '../../store'
import Aggregate from './Aggregate'
import * as settings from '../../settings'
import Calculate from './Calculate'
import Filter from '../Filter/Filter'
import Bin from './Bin'
import Stack from './Stack'
import Fold from './Fold'

const TRANSFORMS: { [key: string]: any } = {
  aggregate: Aggregate,
  calculate: Calculate,
  filter: Filter,
  bin: Bin,
  stack: Stack,
  fold: Fold,
}

export default function Transform() {
  const index = useStore((state) => state.transformState.index)
  return index === undefined ? <TransformList /> : <TransformItem />
}

function TransformList() {
  const isGrid = useStore((state) => state.transformState.isGrid)
  const query = useStore((state) => state.transformState.query)
  const transformItems = useStore(selectors.transformItems)
  const updateTransformState = useStore((state) => state.updateTransformState)
  const addTransform = useStore((state) => state.addTransform)
  const removeTransform = useStore((state) => state.removeTransform)
  return (
    <EditorList
      kind="transform"
      query={query}
      isGrid={isGrid}
      onAddClick={() => addTransform()}
      onGridClick={() => updateTransformState({ isGrid: !isGrid })}
      SearchInput={
        <EditorSearch
          value={query || ''}
          onChange={(query) => updateTransformState({ query })}
        />
      }
    >
      {transformItems.map(({ index, transform }) => (
        <EditorListItem
          key={index}
          kind="transform"
          name={transform.title}
          type="transform"
          isGrid={isGrid}
          onClick={() => {
            updateTransformState({ index })
          }}
          onRemoveClick={() => removeTransform(index)}
        />
      ))}
    </EditorList>
  )
}

function TransformItem() {
  const title = useStore(select(selectors.transform, (transform) => transform.title))
  const isExtras = useStore((state) => state.transformState.isExtras)
  const updateTransformState = useStore((state) => state.updateTransformState)
  const type = useStore((state) => state.transformState.type ?? 'aggregate')
  const ViewTransform = TRANSFORMS[type]
  return (
    <EditorItem
      kind="transform"
      name={title}
      isExtras={isExtras}
      onExtrasClick={() => updateTransformState({ isExtras: !isExtras })}
      onBackClick={() => updateTransformState({ index: undefined, isExtras: false })}
    >
      <Columns>
        <Box>
          <Type />
        </Box>
      </Columns>
      <Columns>
        <Box>
          <ViewTransform />
        </Box>
      </Columns>
    </EditorItem>
  )
}

function Type() {
  const type = useStore((state) => state.transformState.type!)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateTransformType = useStore((state) => state.updateTransformType)
  return (
    <SelectField
      label="Type"
      value={type ?? 'aggregate'}
      options={settings.TRANSFORM_TYPES}
      onFocus={() => updateHelp('transforms/type')}
      onChange={(value) => (value ? updateTransformType(value) : undefined)}
    />
  )
}
