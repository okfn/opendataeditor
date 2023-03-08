import React from 'react'
import { Story, Meta } from '@storybook/react'
import FieldsTree from '../../src/components/Parts/Trees/FieldsTree'

export default {
  title: 'Parts/FieldsTree',
  component: FieldsTree,
} as Meta

const Template: Story<Parameters<typeof FieldsTree>[0]> = (args) => (
  <FieldsTree {...args} />
)

// Props

const tree = [
  {
    name: 'table1',
    path: 'table.csv',
    type: 'table',
    children: [
      { name: 'field1', path: 'table/field1', type: 'integer', children: [] },
      { name: 'field2', path: 'table/field2', type: 'string', children: [] },
    ],
  },
]

export const Default = Template.bind({})
Default.args = {
  tree,
  // onPathChange: console.log,
  onFieldSelected: console.log,
}
