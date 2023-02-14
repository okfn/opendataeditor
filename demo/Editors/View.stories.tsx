import React from 'react'
import { Story, Meta } from '@storybook/react'
import View from '../../src/components/Editors/View'

export default {
  title: 'Editors/View',
  component: View,
} as Meta

const Template: Story<Parameters<typeof View>[0]> = (args) => <View {...args} />

// Props

const fields = [
  { name: 'field1', type: 'integer', tableName: 'table1', tablePath: 'table1.csv' },
  { name: 'field2', type: 'string', tableName: 'table1', tablePath: 'table1.csv' },
  { name: 'field1', type: 'integer', tableName: 'table2', tablePath: 'table2.csv' },
  { name: 'field2', type: 'string', tableName: 'table2', tablePath: 'table2.csv' },
]

// Stories

export const Default = Template.bind({})
Default.args = {
  fields,
  onViewChange: console.log,
}
