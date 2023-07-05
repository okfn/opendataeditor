import { Meta, StoryObj } from '@storybook/react'
import ControlEditor from '../../src/client/components/Editors/Control'
import * as types from '../../src/client/types'

type Story = StoryObj<typeof ControlEditor>
const meta: Meta<typeof ControlEditor> = {
  component: ControlEditor,
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
