import { Meta, StoryObj } from '@storybook/react'
import ResourceEditor from '../../src/client/components/Editors/Resource'
import * as types from '../../src/client/types'

type Story = StoryObj<typeof ResourceEditor>
const meta: Meta<typeof ResourceEditor> = {
  component: ResourceEditor,
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
