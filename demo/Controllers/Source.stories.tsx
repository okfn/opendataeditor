import React from 'react'
import { Story, Meta } from '@storybook/react'
import { Client } from '../../src/client'
import Source from '../../src/components/Controllers/Source'

export default {
  title: 'Controllers/Source',
  component: Source,
} as Meta

const Template: Story<Parameters<typeof Source>[0]> = (args) => <Source {...args} />

// Props

const client = new Client({ session: 'storybooktestersession' })

// Stories

export const Default = Template.bind({})
Default.args = {
  client,
  record: {
    name: 'table',
    type: 'table',
    path: 'table.csv',
    updated: 0,
    resource: {},
    report: {},
  },
}
