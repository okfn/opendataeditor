import React from 'react'
import { Story, Meta } from '@storybook/react'
import Table from '../src/components/Table'

export default {
  title: 'Components/Table',
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
    rows: [
      { id: 1, name: 'english' },
      { id: 2, name: '中国人' },
    ],
  },
}
