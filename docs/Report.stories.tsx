import React from 'react'
import { Story, Meta } from '@storybook/react'
import Report, { ReportProps } from '../src/components/pages/validate/Report'
import reportInvalid from '../data/report-invalid.json'
import reportValid from '../data/report-valid.json'

export default {
  title: 'Components/Report',
  component: Report,
} as Meta

const Template: Story<ReportProps> = (args) => <Report {...args} />

export const Invalid = Template.bind({})
Invalid.args = {
  report: reportInvalid,
}

export const Valid = Template.bind({})
Valid.args = {
  report: reportValid,
}
