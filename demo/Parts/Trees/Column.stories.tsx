import React from 'react'
import { Meta, StoryObj } from '@storybook/react'
import ColumnTree from '../../../src/client/components/Parts/Trees/Column'
import * as types from '../../../src/client/types'

type Story = StoryObj<typeof ColumnTree>
const meta: Meta<typeof ColumnTree> = {
  component: ColumnTree,
}

export default meta

// Data

const columns: types.IColumn[] = [
  { name: 'field1', type: 'integer', tableName: 'table', tablePath: 'table.csv' },
  { name: 'field2', type: 'string', tableName: 'table', tablePath: 'table.csv' },
  { name: 'field3', type: 'datetime', tableName: 'years', tablePath: 'years.csv' },
]

// Stories

export const Default: Story = {
  render: () => (
    <ColumnTree
      columns={columns}
      onPathChange={console.log}
      onPathDoubleClick={console.log}
    />
  ),
}
