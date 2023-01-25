import React from 'react'
import { Story, Meta } from '@storybook/react'
import { Client } from '../../src/client'
import Config from '../../src/components/Controllers/Config'

export default {
  title: 'Controllers/Config',
  component: Config,
} as Meta

const Template: Story<Parameters<typeof Config>[0]> = (args) => <Config {...args} />

export const Default = Template.bind({})
Default.args = {
  client: new Client({ session: '0ZboLklNFmEyRnUSnMgtMg' }),
}
