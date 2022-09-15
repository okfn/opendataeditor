import React from 'react'
import { Story, Meta } from '@storybook/react'
import { Client } from '../../src/client'
import Dataset from '../../src/components/Editors/Dataset'

const Template: Story<Parameters<typeof Dataset>[0]> = (args) => <Dataset {...args} />
export default {
  title: 'Editors/Dataset',
  component: Dataset,
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
