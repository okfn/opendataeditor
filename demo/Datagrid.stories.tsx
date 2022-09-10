import React from 'react'
import { Story, Meta } from '@storybook/react'
import Datagrid from '../src/components/Datagrid'
import reportValid from '../data/report-valid.json'

export default {
  title: 'Components/Datagrid',
  component: Datagrid,
} as Meta

const Template: Story<Parameters<typeof Datagrid>[0]> = (args) => <Datagrid {...args} />

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
