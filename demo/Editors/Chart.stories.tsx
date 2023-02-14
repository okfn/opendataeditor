import React from 'react'
import { Story, Meta } from '@storybook/react'
import Chart from '../../src/components/Editors/Chart'

export default {
  title: 'Editors/Chart',
  component: Chart,
} as Meta

const Template: Story<Parameters<typeof Chart>[0]> = (args) => <Chart {...args} />

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
  onChartChange: console.log,
}
