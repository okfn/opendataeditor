import { Meta, StoryObj } from '@storybook/react'
import FileTree from '../../../src/client/components/Parts/Trees/File'
import * as types from '../../../src/client/types'

type Story = StoryObj<typeof FileTree>
const meta: Meta<typeof FileTree> = {
  component: FileTree,
}

export default meta

// Data

const files: types.IFile[] = [
  { name: 'table1', type: 'table', path: 'folder/table1.csv' },
  { name: 'table2', type: 'table', path: 'folder/table2.csv' },
]

// Stories

export const Default: Story = {
  args: {
    files,
    onSelect: console.log,
  },
}

export const Added: Story = {
  args: {
    ...Default.args,
    defaultExpanded: ['folder1'],
    event: { type: 'create', paths: ['folder/table2.csv'] },
  },
}
