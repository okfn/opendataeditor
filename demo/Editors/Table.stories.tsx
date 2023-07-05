import { Meta, StoryObj } from '@storybook/react'
import TableEditor from '../../src/client/components/Editors/Table'
import * as types from '../../src/client/types'

type Story = StoryObj<typeof TableEditor>
const meta: Meta<typeof TableEditor> = {
  component: TableEditor,
}

export default meta

// Data

const source: types.IRow[] = [
  { _rowNumber: 2, id: 1, name: 'english' },
  { _rowNumber: 3, id: 2, name: 'spanish' },
]
const schema: types.ISchema = {
  fields: [
    { name: 'id', type: 'integer', format: 'default' },
    { name: 'name', type: 'string', format: 'default' },
  ],
}

// Stories

export const Default: Story = {
  args: {
    source,
    schema,
    onEditComplete: console.log,
  },
}
