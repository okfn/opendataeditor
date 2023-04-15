import React from 'react'
import { Story, Meta } from '@storybook/react'
import { Client } from '../../src/client'
import Application from '../../src/components/Applications/Application'

export default {
  title: 'Controllers/Application',
  component: Application,
} as Meta

const Template: Story<Parameters<typeof Application>[0]> = (args) => (
  <Application {...args} />
)

// Props

const client = new Client()

// Stories

export const Default = Template.bind({})
Default.args = {
  client,
}
