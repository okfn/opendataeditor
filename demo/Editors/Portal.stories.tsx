import { Meta, StoryObj } from '@storybook/react'
import PortalEditor from '../../src/client/components/Editors/Portal'
import * as types from '../../src/client/types'

type Story = StoryObj<typeof PortalEditor>
const meta: Meta<typeof PortalEditor> = {
  component: PortalEditor,
}

export default meta

// Data

const portal: types.IPortal = { type: 'ckan' }

// Stories

export const Default: Story = {
  args: {
    portal,
    onChange: console.log,
  },
}
