import React from 'react'
import { Story, Meta } from '@storybook/react'
import Table2 from '../src/components/Table2'
import reportValid from '../data/report-valid.json'

export default {
  title: 'Components/Table2',
  component: Table2,
} as Meta

const Template: Story<Parameters<typeof Table2>[0]> = (args) => <Table2 {...args} />

export const Default = Template.bind({})
Default.args = {
  resource: {
    name: 'table',
    type: 'table',
    path: 'table.csv',
    scheme: 'file',
    format: 'csv',
    encoding: 'utf-8',
  },
  table: {
    schema: {
      fields: [
        { name: 'id', type: 'integer', format: 'default' },
        { name: 'name', type: 'string', format: 'default' },
      ],
      missingValues: [''],
    },
    header: ['id', 'name'],
    rows: [
      { id: 1, name: 'english' },
      { id: 2, name: '中国人' },
    ],
  },
  report: reportValid,
  source: '1,english\n2,中国人\n',
  exportTable: console.log,
  updateTable: console.log,
  updateResource: console.log,
}
