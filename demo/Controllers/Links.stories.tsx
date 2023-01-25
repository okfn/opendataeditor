import React from 'react'
import { Story, Meta } from '@storybook/react'
import { Client } from '../../src/client'
import Links from '../../src/components/Controllers/Links'

export default {
  title: 'Controllers/Links',
  component: Links,
} as Meta

const Template: Story<Parameters<typeof Links>[0]> = (args) => <Links {...args} />

export const Default = Template.bind({})
Default.args = {
  client: new Client({ session: '0ZboLklNFmEyRnUSnMgtMg' }),
}
