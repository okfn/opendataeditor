import { Meta, StoryObj } from '@storybook/react'
import MenuTree from '../../../src/client/components/Parts/Trees/Menu'
import * as types from '../../../src/client/types'

type Story = StoryObj<typeof MenuTree>
const meta: Meta<typeof MenuTree> = {
  component: MenuTree,
}

export default meta

// Data

const menuItems: types.IMenuItem[] = [
  { name: 'Resource', section: 'resource' },
  { name: 'Licenses', section: 'resource/license' },
  { name: 'Contributors', section: 'resource/contributors' },
  { name: 'Schema', section: 'schema' },
  { name: 'Fields', section: 'schema/field' },
  { name: 'Foreign Keys', section: 'schema/foreignKey' },
]

// Stories

export const Default: Story = {
  args: {
    menuItems,
    onSelect: console.log,
  },
}
