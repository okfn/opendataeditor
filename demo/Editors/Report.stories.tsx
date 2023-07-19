import { Meta, StoryObj } from '@storybook/react'
import ReportEditor from '../../src/client/components/Editors/Report'
import reportInvalid from '../../data/report-invalid.json'
import reportValid from '../../data/report-valid.json'

type Story = StoryObj<typeof ReportEditor>
const meta: Meta<typeof ReportEditor> = {
  component: ReportEditor,
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

export const Shallow: Story = {
  args: {
    shallow: true,
    report: reportInvalid,
  },
}
