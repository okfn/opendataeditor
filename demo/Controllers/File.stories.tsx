import React from 'react'
import { Story, Meta } from '@storybook/react'
import { Client } from '../../src/client'
import File from '../../src/components/Controllers/File'

const Template: Story<Parameters<typeof File>[0]> = (args) => <File {...args} />
export default {
  title: 'Controllers/File',
  component: File,
} as Meta

// Props

const client = new Client({ session: 'storybooktestersession' })
const record = {
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

export const Data = Template.bind({})
Data.args = {
  client,
  record,
}

export const Metadata = Template.bind({})
Metadata.args = {
  client,
  record,
  isMetadata: true,
}
