import React from 'react'
import { Story, Meta } from '@storybook/react'
import { Client } from '../../src/client'
import Metadata from '../../src/client/components/Controllers/Metadata'

const Template: Story<Parameters<typeof Metadata>[0]> = (args) => <Metadata {...args} />
export default {
  title: 'Controllers/Metadata',
  component: Metadata,
} as Meta

// Props

const client = new Client()
const file = {
  name: 'table',
  type: 'table',
  path: 'table.csv',
  updated: 0,
  resource: {
    path: 'table.csv',
  },
  report: {},
}

// Stories

export const Default = Template.bind({})
Default.args = {
  client,
  file,
}
