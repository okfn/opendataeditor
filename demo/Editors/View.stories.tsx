import { Meta, StoryObj } from '@storybook/react'
import ViewEditort from '../../src/client/components/Editors/View'
import * as types from '../../src/client/types'

type Story = StoryObj<typeof ViewEditort>
const meta: Meta<typeof ViewEditort> = {
  component: ViewEditort,
}

export default meta

// Data

const view: types.IView = { query: '' }
const columns: types.IColumn[] = [
  { name: 'field1', type: 'integer', tableName: 'table1', tablePath: 'table1.csv' },
  { name: 'field2', type: 'string', tableName: 'table1', tablePath: 'table1.csv' },
  { name: 'field1', type: 'integer', tableName: 'table2', tablePath: 'table2.csv' },
  { name: 'field2', type: 'string', tableName: 'table2', tablePath: 'table2.csv' },
]

// Stories

export const Default: Story = {
  args: {
    view,
    columns,
    onChange: console.log,
  },
}
