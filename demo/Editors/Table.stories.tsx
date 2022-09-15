import React from 'react'
import { Story, Meta } from '@storybook/react'
import { Client } from '../../src/client'
import Table from '../../src/components/Editors/Table'
import reportValid from '../../data/report-valid.json'

export default {
  title: 'Editors/Table',
  component: Table,
} as Meta

const Template: Story<Parameters<typeof Table>[0]> = (args) => <Table {...args} />

export const Default = Template.bind({})
Default.args = {
  client: new Client({ session: '0ZboLklNFmEyRnUSnMgtMg' }),
  record: {
    name: 'table',
    type: 'table',
    path: 'table.csv',
    updated: 0,
    resource: {
      path: 'table.csv',
    },
    report: reportValid,
  },
}
