import React from 'react'
import { Story, Meta } from '@storybook/react'
import FileTree from '../../src/components/Parts/Trees/File'

export default {
  title: 'Parts/FileTree',
  component: FileTree,
} as Meta

const Template: Story<Parameters<typeof FileTree>[0]> = (args) => <FileTree {...args} />

// Props

const tree = [
  {
    name: 'folder1',
    path: 'folder1',
    type: 'folder',
    children: [
      { name: 'table1', path: 'folder/table1', type: 'table', children: [] },
      { name: 'table2', path: 'folder/table2', type: 'table', children: [] },
    ],
  },
]

// Stories

export const Default = Template.bind({})
Default.args = {
  tree,
  onSelect: console.log,
}

export const Added = Template.bind({})
Added.args = {
  tree,
  event: { type: 'create', paths: ['folder/table2'] },
  defaultExpanded: ['folder1'],
  onSelect: console.log,
}

export const Drafted = Template.bind({})
Drafted.args = {
  tree,
  event: { type: 'draft', paths: ['folder/table2'] },
  defaultExpanded: ['folder1'],
  onSelect: console.log,
}
