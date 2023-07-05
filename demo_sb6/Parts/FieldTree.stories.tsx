import React from 'react'
import { Story, Meta } from '@storybook/react'
import FieldTree from '../../client/src/components/Parts/Trees/Field'

export default {
  title: 'Parts/FieldTree',
  component: FieldTree,
} as Meta

const Template: Story<Parameters<typeof FieldTree>[0]> = (args) => <FieldTree {...args} />

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

// Stories

export const Default = Template.bind({})
Default.args = {
  tree,
  onPathChange: console.log,
  onPathDoubleClick: console.log,
}
