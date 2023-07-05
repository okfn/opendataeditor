import { Meta, StoryObj } from '@storybook/react'
import ControlEditort from '../../src/client/components/Editors/Control'
import * as types from '../../src/client/types'

type Story = StoryObj<typeof ControlEditort>
const meta: Meta<typeof ControlEditort> = {
  component: ControlEditort,
}

export default meta

// Data

const control: Partial<types.IControl> = {}

// Stories

export const Default: Story = {
  args: {
    control,
    onChange: console.log,
  },
}
