import React from 'react'
import { Story, Meta } from '@storybook/react'
import Status from '../src/components/Status'

export default {
  title: 'Components/Status',
  component: Status,
} as Meta

const Template: Story<Parameters<typeof Status>[0]> = (args) => <Status {...args} />

export const Default = Template.bind({})
Default.args = {
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
  text: '1,english\n2,中国人\n',
}
