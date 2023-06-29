import * as React from 'react'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import Columns from '../../../Parts/Columns'
import InputField from '../../../Parts/Fields/Input'
import SelectField from '../../../Parts/Fields/Select'
import EditorItem from '../../Base/Item'
import EditorList from '../../Base/List'
import EditorListItem from '../../Base/ListItem'
import EditorSearch from '../../Base/Search'
import ScrollBox from '../../../Parts/Boxes/Scroll'
import { useStore, selectors, select } from '../store'

export default function ForeignKey() {
  const index = useStore((state) => state.foreignKeyState.index)
  return index === undefined ? <ForeignKeyList /> : <ForeignKeyItem />
}

function ForeignKeyList() {
  const theme = useTheme()
  const height = `calc(100vh - ${theme.spacing(8 + 8 + 15)})`
  const isGrid = useStore((state) => state.foreignKeyState.isGrid)
  const query = useStore((state) => state.foreignKeyState.query)
  const foreignKeyItems = useStore(selectors.foreignKeyItems)
  const updateForeignKeyState = useStore((state) => state.updateForeignKeyState)
  const addForeignKey = useStore((state) => state.addForeignKey)
  const removeForeignKey = useStore((state) => state.removeForeignKey)
  return (
    <EditorList
      kind="foreign key"
      query={query}
      isGrid={isGrid}
      onAddClick={() => addForeignKey()}
      onGridClick={() => updateForeignKeyState({ isGrid: !isGrid })}
      SearchInput={
        <EditorSearch
          value={query || ''}
          onChange={(query) => updateForeignKeyState({ query })}
        />
      }
    >
      <ScrollBox sx={{ height }}>
        {foreignKeyItems.map(({ index, foreignKey }) => (
          <EditorListItem
            key={index}
            kind="foreign key"
            name={foreignKey.fields.join(',')}
            type="fk"
            isGrid={isGrid}
            onClick={() => updateForeignKeyState({ index })}
            onRemoveClick={() => removeForeignKey(index)}
          />
        ))}
      </ScrollBox>
    </EditorList>
  )
}

function ForeignKeyItem() {
  const fields = useStore(select(selectors.foreignKey, (foreignKey) => foreignKey.fields))
  const isExtras = useStore((state) => state.foreignKeyState.isExtras)
  const updateForeignKeyState = useStore((state) => state.updateForeignKeyState)
  return (
    <EditorItem
      kind="foreignKey"
      name={fields.join(',')}
      isExtras={isExtras}
      onExtrasClick={() => updateForeignKeyState({ isExtras: !isExtras })}
      onBackClick={() => updateForeignKeyState({ index: undefined, isExtras: false })}
    >
      <Columns spacing={3}>
        <Box>
          <SourceField />
          <TargetField />
        </Box>
        <Box>
          <TargetResource />
        </Box>
      </Columns>
    </EditorItem>
  )
}

function SourceField() {
  const fields = useStore(select(selectors.foreignKey, (foreignKey) => foreignKey.fields))
  const fieldNames = useStore(selectors.fieldNames)
  const updateForeignKey = useStore((state) => state.updateForeignKey)
  return (
    <SelectField
      label="Source Field"
      value={fields[0]}
      options={fieldNames}
      onChange={(name) => updateForeignKey({ fields: [name] })}
    />
  )
}

function TargetField() {
  const reference = useStore(
    select(selectors.foreignKey, (foreignKey) => foreignKey.reference)
  )
  const updateForeignKey = useStore((state) => state.updateForeignKey)
  return (
    <SelectField
      label="Target Field"
      value={reference.fields[0]}
      options={reference.fields}
      onChange={(name) =>
        updateForeignKey({ reference: { ...reference, fields: [name] } })
      }
    />
  )
}

function TargetResource() {
  const reference = useStore(
    select(selectors.foreignKey, (foreignKey) => foreignKey.reference)
  )
  const updateForeignKey = useStore((state) => state.updateForeignKey)
  return (
    <InputField
      disabled
      label="Target Resource"
      value={reference.resource}
      onChange={(resource) => updateForeignKey({ reference: { ...reference, resource } })}
    />
  )
}
