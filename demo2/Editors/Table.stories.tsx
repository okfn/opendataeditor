import React from 'react'
import { Story, Meta } from '@storybook/react'
import { Client } from '../src/client'
import Table from '../src/components/Table'

export default {
  title: 'Components/Table',
  component: Table,
} as Meta

const Template: Story<Parameters<typeof Table>[0]> = (args) => <Table {...args} />

export const Default = Template.bind({})
Default.args = {
  client: new Client({ session: '0ZboLklNFmEyRnUSnMgtMg' }),
  path: 'table.csv',
}
