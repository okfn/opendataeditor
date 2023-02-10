import React from 'react'
import { Story, Meta } from '@storybook/react'
import { Client } from '../../src/client'
import Report from '../../src/components/Controllers/Report'
import reportInvalid from '../../data/report-invalid.json'

export default {
  title: 'Controllers/Report',
  component: Report,
} as Meta

const Template: Story<Parameters<typeof Report>[0]> = (args) => <Report {...args} />

// Props

const client = new Client({ session: 'storybooktestersession' })

// Stories

export const Default = Template.bind({})
Default.args = {
  client,
  record: {
    name: 'invalid',
    type: 'table',
    path: 'invalid.csv',
    updated: 0,
    resource: {},
    report: reportInvalid,
  },
}
