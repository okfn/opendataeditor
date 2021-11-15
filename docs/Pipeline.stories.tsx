import React from 'react'
import { Story, Meta } from '@storybook/react'
import Pipeline from '../src/components/Pipeline'

export default {
  title: 'Components/Pipeline',
  component: Pipeline,
} as Meta

const Template: Story<Parameters<typeof Pipeline>[0]> = (args) => <Pipeline {...args} />

export const Default = Template.bind({})
Default.args = {
  pipeline: {
    tasks: [
      {
        source: { path: 'table.csv' },
        steps: [{ code: 'table-normalize', descriptor: '' }],
      },
    ],
  },
  onSave: (pipeline: any) => console.log(pipeline),
}
