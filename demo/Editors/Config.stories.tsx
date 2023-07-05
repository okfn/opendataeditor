import { Meta, StoryObj } from '@storybook/react'
import ConfigEditor from '../../src/client/components/Editors/Config'
import * as types from '../../src/client/types'

type Story = StoryObj<typeof ConfigEditor>
const meta: Meta<typeof ConfigEditor> = {
  component: ConfigEditor,
}

export default meta

// Data

const config: types.IConfig = {
  system: {},
  project: {},
}

// Stories

export const Default: Story = {
  args: {
    config,
    onChange: console.log,
  },
}
