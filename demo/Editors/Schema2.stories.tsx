import React from 'react'
import { Story, Meta } from '@storybook/react'
import Schema from '../../src/components/Editors/Schema2'

export default {
  title: 'Editors/Schema2',
  component: Schema,
} as Meta

const Template: Story<Parameters<typeof Schema>[0]> = (args) => <Schema {...args} />

// Props

const schema = {
  fields: [
    { name: 'id', type: 'integer', format: 'default' },
    { name: 'name', type: 'string', format: 'default' },
  ],
  missingValues: [''],
}

// Stories

export const Default = Template.bind({})
Default.args = {
  schema,
  onChange: console.log,
  onFieldSelected: console.log,
}
