import React from 'react'
import { Story, Meta } from '@storybook/react'
import { Client } from '../../src/client'
import Sql from '../../src/components/Controllers/Sql'

export default {
  title: 'Controllers/Sql',
  component: Sql,
} as Meta

const Template: Story<Parameters<typeof Sql>[0]> = (args) => <Sql {...args} />

export const Default = Template.bind({})
Default.args = {
  client: new Client({ session: '0ZboLklNFmEyRnUSnMgtMg' }),
}
