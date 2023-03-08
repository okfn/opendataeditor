// TODO: enable (vega-lite is failing ATM)
import React from 'react'
import { Story, Meta } from '@storybook/react'
import { Client } from '../../src/client'
import Application from '../../src/components/Application'

const Template: Story<Parameters<typeof Application>[0]> = (args) => (
  <Application {...args} />
)
export default {
  title: 'Application/Application',
  component: Application,
} as Meta

// Props

const client = new Client({ session: 'storybooktestersession' })

// Stories

export const Default = Template.bind({})
Default.args = {
  client,
}
