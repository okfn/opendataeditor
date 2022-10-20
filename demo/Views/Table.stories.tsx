import React from 'react'
import { Story, Meta } from '@storybook/react'
import Table from '../../src/components/Views/Table'
import reportValid from '../../data/report-valid.json'

export default {
  title: 'Views/Table',
  component: Table,
} as Meta

const Template: Story<Parameters<typeof Table>[0]> = (args) => <Table {...args} />

export const Default = Template.bind({})
Default.args = {
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
  onUpdate: console.log,
}
