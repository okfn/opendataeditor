import * as React from 'react'
import EditorItem from '../../../Parts/Editor/EditorItem'
import EditorList from '../../../Parts/Editor/EditorList'
import EditorListItem from '../../../Parts/Editor/EditorListItem'
import { useStore, selectors } from '../store'

export default function Field() {
  const index = useStore((state) => state.fieldInfo.index)
  return <>{index ? <FieldItem /> : <FieldList />}</>
}

function FieldList() {
  const isGrid = useStore((state) => state.fieldInfo.isGrid)
  const query = useStore((state) => state.fieldInfo.query)
  const fieldInfo = useStore((state) => state.fieldInfo)
  const updateFieldInfo = useStore((state) => state.updateFieldInfo)
  const foundFieldItems = useStore(selectors.foundFieldItems)
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
          onClick={() => {
            fieldInfo.index = index
            updateFieldInfo(fieldInfo)
          }}
          title="View Field"
        />
      ))}
    </EditorList>
  )
}

function FieldItem() {
  return <EditorItem kind="field" onRemoveClick={() => console.log('remove')} />
}
