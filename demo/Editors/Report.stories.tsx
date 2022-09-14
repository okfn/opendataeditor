import React from 'react'
import { Story, Meta } from '@storybook/react'
import { Client } from '../../src/client'
import Report from '../../src/components/Editors/Report'
import reportInvalid from '../../data/report-invalid.json'

export default {
  title: 'Editors/Report',
  component: Report,
} as Meta

const Template: Story<Parameters<typeof Report>[0]> = (args) => <Report {...args} />

export const Default = Template.bind({})
Default.args = {
  client: new Client({ session: '0ZboLklNFmEyRnUSnMgtMg' }),
  record: {
    name: 'invalid',
    type: 'table',
    updated: 0,
    resource: {},
    report: reportInvalid,
  },
}
