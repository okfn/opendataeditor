import { Meta, StoryObj } from '@storybook/react'
import ConfigEditort from '../../src/client/components/Editors/Config'
import * as types from '../../src/client/types'

type Story = StoryObj<typeof ConfigEditort>
const meta: Meta<typeof ConfigEditort> = {
  component: ConfigEditort,
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
