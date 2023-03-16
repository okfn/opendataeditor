import * as React from 'react'
import ItemButton from '../../../Parts/Buttons/ItemButton'
import HeadingBox from '../../../Parts/Groups/HeadingBox'
import { useStore, selectors } from '../store'

export default function Fields() {
  const foundFieldItems = useStore(selectors.foundFieldItems)
  return (
    <React.Fragment>
      <HeadingBox>Fields</HeadingBox>
      {foundFieldItems.length ? <FoundItems /> : <NotFoundItems />}
    </React.Fragment>
  )
}

function FoundItems() {
  const foundFieldItems = useStore(selectors.foundFieldItems)
  const isGrid = useStore((state) => state.fieldInfo.isGrid)
  const fieldInfo = useStore((state) => state.fieldInfo)
  const updateFieldInfo = useStore((state) => state.updateFieldInfo)
  return (
    <>
      {foundFieldItems.map(({ index, field }) => (
        <ItemButton
          key={index}
          index={index}
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
    </>
  )
}

function NotFoundItems() {
  const fields = useStore((state) => state.schema.fields)
  const query = useStore((state) => state.fieldInfo.query)
  const message = fields.length && query ? 'found' : 'added'
  return <ItemButton disabled name={`No fields ${message}`} />
}
