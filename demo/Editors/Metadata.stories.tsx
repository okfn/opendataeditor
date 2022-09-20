import React from 'react'
import { Story, Meta } from '@storybook/react'
import { Client } from '../../src/client'
import Metadata from '../../src/components/Editors/Metadata'

const Template: Story<Parameters<typeof Metadata>[0]> = (args) => <Metadata {...args} />
export default {
  title: 'Editors/Metadata',
  component: Metadata,
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

export const Default = Template.bind({})
Default.args = {
  client,
  record,
}
