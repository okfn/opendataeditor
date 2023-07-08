import { Meta, StoryObj } from '@storybook/react'
import PickDialog from '../../../src/client/components/Parts/Dialogs/Pick'

type Story = StoryObj<typeof PickDialog>
const meta: Meta<typeof PickDialog> = {
  component: PickDialog,
}

export default meta

// Data

const items = ['path1.csv', 'path2.csv', 'path3.csv']

// Stories

export const Default: Story = {
  args: {
    items,
    onConfirm: console.log,
    onCancel: console.log,
  },
}
