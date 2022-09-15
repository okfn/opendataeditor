import React from 'react'
import { Story, Meta } from '@storybook/react'
import { Client } from '../../src/client'
import Table from '../../src/components/Editors/Table'
import reportValid from '../../data/report-valid.json'

const Template: Story<Parameters<typeof Table>[0]> = (args) => <Table {...args} />
export default {
  title: 'Editors/Table',
  component: Table,
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
  report: reportValid,
}

// Components

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
