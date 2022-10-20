import React from 'react'
import { Story, Meta } from '@storybook/react'
import Pipeline from '../../src/components/Views/Pipeline'

export default {
  title: 'Views/Pipeline',
  component: Pipeline,
} as Meta

const Template: Story<Parameters<typeof Pipeline>[0]> = (args) => <Pipeline {...args} />

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
  onCommit: (pipeline: any) => console.log(pipeline),
  onRevert: (pipeline: any) => console.log(pipeline),
}
