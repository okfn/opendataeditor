import { Meta, StoryObj } from '@storybook/react'
import ChartEditort from '../../src/client/components/Editors/Chart'
import * as types from '../../src/client/types'

type Story = StoryObj<typeof ChartEditort>
const meta: Meta<typeof ChartEditort> = {
  component: ChartEditort,
}

export default meta

// Data

const columns: types.IColumn[] = [
  { name: 'field1', type: 'integer', tableName: 'table1', tablePath: 'table1.csv' },
  { name: 'field2', type: 'string', tableName: 'table1', tablePath: 'table1.csv' },
  { name: 'field1', type: 'integer', tableName: 'table2', tablePath: 'table2.csv' },
  { name: 'field2', type: 'string', tableName: 'table2', tablePath: 'table2.csv' },
]

// Stories

export const Default: Story = {
  args: {
    fields: columns,
    onChange: console.log,
  },
}
