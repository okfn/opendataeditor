import { Meta, StoryObj } from '@storybook/react'
import ResourceEditort from '../../src/client/components/Editors/Resource'
import * as types from '../../src/client/types'

type Story = StoryObj<typeof ResourceEditort>
const meta: Meta<typeof ResourceEditort> = {
  component: ResourceEditort,
}

export default meta

// Data

const resource: types.IResource = {
  name: 'table',
  type: 'table',
  path: 'table.csv',
}

// Stories

export const Default: Story = {
  args: {
    resource,
    onChange: console.log,
  },
}
