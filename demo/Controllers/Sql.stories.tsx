import React from 'react'
import { Story, Meta } from '@storybook/react'
import { Client } from '../../src/client'
import Sql from '../../src/components/Controllers/Sql'

export default {
  title: 'Controllers/Sql',
  component: Sql,
} as Meta

const Template: Story<Parameters<typeof Sql>[0]> = (args) => <Sql {...args} />

// Props

const client = new Client({ session: 'storybooktestersession' })

// Stories

export const Default = Template.bind({})
Default.args = {
  client,
}
