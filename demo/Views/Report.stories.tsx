import React from 'react'
import { Story, Meta } from '@storybook/react'
import Report from '../../src/components/Views/Report'
import reportInvalid from '../../data/report-invalid.json'
import reportValid from '../../data/report-valid.json'

export default {
  title: 'Views/Report',
  component: Report,
} as Meta

const Template: Story<Parameters<typeof Report>[0]> = (args) => <Report {...args} />

export const Invalid = Template.bind({})
Invalid.args = {
  report: reportInvalid,
}

export const Valid = Template.bind({})
Valid.args = {
  report: reportValid,
}
