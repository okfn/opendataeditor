import { Meta, StoryObj } from '@storybook/react'
import ReportEditort from '../../src/client/components/Editors/Report'
import reportInvalid from '../../data/report-invalid.json'
import reportValid from '../../data/report-valid.json'

type Story = StoryObj<typeof ReportEditort>
const meta: Meta<typeof ReportEditort> = {
  component: ReportEditort,
}

export default meta

// Stories

export const Default: Story = {
  args: {
    report: reportValid,
  },
}

export const Invalid: Story = {
  args: {
    report: reportInvalid,
  },
}
