import * as React from 'react'
import HeadingBox from '../../Library/Groups/HeadingBox'
import SelectField from '../../Library/Fields/SelectField'
import MultiselectField from '../../Library/Fields/MultiselectField'
import { useStore } from '../store'

export default function Cells() {
  return (
    <React.Fragment>
      <HeadingBox>Cells</HeadingBox>
      <FilterCells />
      <OrderCells />
    </React.Fragment>
  )
}

function FilterCells() {
  const filterCells = useStore((state) => state.descriptor.filterCells)
  const update = useStore((state) => state.update)
  return (
    <MultiselectField
      label="Filter Cells"
      value={filterCells || []}
      options={['valid', 'error', 'blank']}
      onChange={(filterCells) => update({ filterCells })}
    />
  )
}

function OrderCells() {
  const orderCells = useStore((state) => state.descriptor.orderCells)
  const schema = useStore((state) => state.schema)
  const update = useStore((state) => state.update)
  return (
    <SelectField
      label="Order Cells"
      value={orderCells || ''}
      options={schema.fields.map((field) => field.name)}
      onChange={(orderCells) => update({ orderCells })}
    />
  )
}
