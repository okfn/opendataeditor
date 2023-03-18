import * as React from 'react'
import Box from '@mui/material/Box'
import Columns from '../../../Parts/Columns'
import InputField from '../../../Parts/Fields/InputField'
import SelectField from '../../../Parts/Fields/SelectField'
import EditorItem from '../../../Parts/Editor/EditorItem'
import EditorList from '../../../Parts/Editor/EditorList'
import EditorListItem from '../../../Parts/Editor/EditorListItem'
import EditorSearch from '../../../Parts/Editor/EditorSearch'
import { useStore, selectors, select } from '../store'

export default function ForeignKey() {
  const index = useStore((state) => state.foreignKeyState.index)
  return index === undefined ? <ForeignKeyList /> : <ForeignKeyItem />
}

function ForeignKeyList() {
  const isGrid = useStore((state) => state.foreignKeyState.isGrid)
  const query = useStore((state) => state.foreignKeyState.query)
  const foundForeignKeyItems = useStore(selectors.foundForeignKeyItems)
  const updateForeignKeyState = useStore((state) => state.updateForeignKeyState)
  const addForeignKey = useStore((state) => state.addForeignKey)
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
      {foundForeignKeyItems.map(({ index, foreignKey }) => (
        <EditorListItem
          key={index}
          index={index}
          kind="foreign key"
          name={foreignKey.fields.join(',')}
          type="fk"
          isGrid={isGrid}
          onClick={() => updateForeignKeyState({ index })}
          title="View ForeignKey"
        />
      ))}
    </EditorList>
  )
}

function ForeignKeyItem() {
  const { foreignKey } = useStore(selectors.foreignKey)
  const isExtras = useStore((state) => state.foreignKeyState.isExtras)
  const removeForeignKey = useStore((state) => state.removeForeignKey)
  const updateForeignKeyState = useStore((state) => state.updateForeignKeyState)
  return (
    <EditorItem
      kind="foreignKey"
      name={foreignKey.fields.join(',')}
      isExtras={isExtras}
      onExtrasClick={() => updateForeignKeyState({ isExtras: !isExtras })}
      onRemoveClick={() => removeForeignKey()}
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
  const fields = useStore(
    select(selectors.foreignKey, ({ foreignKey }) => foreignKey.fields)
  )
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
  const fieldNames = useStore(selectors.fieldNames)
  const reference = useStore(
    select(selectors.foreignKey, ({ foreignKey }) => foreignKey.reference)
  )
  const updateForeignKey = useStore((state) => state.updateForeignKey)
  return (
    <SelectField
      label="Target Field"
      value={reference.fields[0]}
      options={fieldNames}
      onChange={(name) =>
        updateForeignKey({ reference: { ...reference, fields: [name] } })
      }
    />
  )
}

function TargetResource() {
  const reference = useStore(
    select(selectors.foreignKey, ({ foreignKey }) => foreignKey.reference)
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
