import React from 'react'
import { Story, Meta } from '@storybook/react'
import Checklist from '../../src/components/Views/Checklist'

export default {
  title: 'Views/Checklist',
  component: Checklist,
} as Meta

const Template: Story<Parameters<typeof Checklist>[0]> = (args) => <Checklist {...args} />

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
  onCommit: (checklist: any) => console.log(checklist),
  onRevert: (checklist: any) => console.log(checklist),
}
