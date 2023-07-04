import { Meta, StoryObj } from '@storybook/react'
import PackageEditort from '../../src/client/components/Editors/Package'
import * as types from '../../src/client/types'

type Story = StoryObj<typeof PackageEditort>
const meta: Meta<typeof PackageEditort> = {
  component: PackageEditort,
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
