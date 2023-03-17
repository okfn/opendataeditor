import * as React from 'react'
import EditorItem from '../../../Parts/Editor/EditorItem'
import EditorList from '../../../Parts/Editor/EditorList'
import EditorListItem from '../../../Parts/Editor/EditorListItem'
import { useStore, selectors } from '../store'

export default function Field() {
  const index = useStore((state) => state.fieldState.index)
  return <>{index ? <FieldItem /> : <FieldList />}</>
}

function FieldList() {
  const isGrid = useStore((state) => state.fieldState.isGrid)
  const query = useStore((state) => state.fieldState.query)
  const foundFieldItems = useStore(selectors.foundFieldItems)
  const updateFieldState = useStore((state) => state.updateFieldState)
  return (
    <EditorList
      kind="field"
      query={query}
      isGrid={isGrid}
      onAddClick={() => console.log('add')}
      onGridClick={() => console.log('grid')}
      onQueryChange={() => console.log('query')}
    >
      {foundFieldItems.map(({ index, field }) => (
        <EditorListItem
          key={index}
          index={index}
          kind="field"
          name={field.name}
          type={field.type}
          isGrid={isGrid}
          onClick={() => updateFieldState({ index })}
          title="View Field"
        />
      ))}
    </EditorList>
  )
}

function FieldItem() {
  return <EditorItem kind="field" onRemoveClick={() => console.log('remove')} />
}
