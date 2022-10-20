import React from 'react'
import { Story, Meta } from '@storybook/react'
import { Client } from '../../src/client'
import File from '../../src/components/Editors/File'

const Template: Story<Parameters<typeof File>[0]> = (args) => <File {...args} />
export default {
  title: 'Editors/File',
  component: File,
} as Meta

// Props

const client = new Client({ session: '0ZboLklNFmEyRnUSnMgtMg' })
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
