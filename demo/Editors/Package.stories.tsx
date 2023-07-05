import { Meta, StoryObj } from '@storybook/react'
import PackageEditor from '../../src/client/components/Editors/Package'
import * as types from '../../src/client/types'

type Story = StoryObj<typeof PackageEditor>
const meta: Meta<typeof PackageEditor> = {
  component: PackageEditor,
}

export default meta

// Data

const pkg: types.IPackage = {
  resources: [],
}

// Stories

export const Default: Story = {
  args: {
    package: pkg,
    onChange: console.log,
  },
}
