import React from 'react'
import { Story, Meta } from '@storybook/react'
import Inquiry from '../src/components/Inquiry'

export default {
  title: 'Components/Inquiry',
  component: Inquiry,
} as Meta

const Template: Story<Parameters<typeof Inquiry>[0]> = (args) => <Inquiry {...args} />

export const Default = Template.bind({})
Default.args = {
  descriptor: {},
  schema: {
    fields: [
      { name: 'id', type: 'integer', format: 'default' },
      { name: 'name', type: 'string', format: 'default' },
    ],
    missingValues: [''],
  },
  onCommit: (inquiry: any) => console.log(inquiry),
  onRevert: (inquiry: any) => console.log(inquiry),
}
