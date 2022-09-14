import React from 'react'
import { Story, Meta } from '@storybook/react'
import { Client } from '../src/client'
import Browser from '../src/components/Browser'

export default {
  title: 'Components/Browser',
  component: Browser,
} as Meta

const Template: Story<Parameters<typeof Browser>[0]> = (args) => <Browser {...args} />

export const Default = Template.bind({})
Default.args = {
  client: new Client({ session: '0ZboLklNFmEyRnUSnMgtMg' }),
  path: 'table.csv',
}
