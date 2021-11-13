import React from 'react'
import { Story, Meta } from '@storybook/react'
import Schema from '../src/components/Schema'

export default {
  title: 'Components/Schema',
  component: Schema,
} as Meta

const Template: Story<Parameters<typeof Schema>[0]> = (args) => <Schema {...args} />

export const Default = Template.bind({})
Default.args = {
  schema: {
    fields: [{ name: 'id', type: 'integer', format: 'default' }],
    missingValues: [''],
  },
  onSave: (schema: any) => console.log(schema),
}
