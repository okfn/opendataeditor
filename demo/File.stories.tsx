import React from 'react'
import { Story, Meta } from '@storybook/react'
import { Client } from '../src/client'
import File from '../src/components/File'

export default {
  title: 'Components/File',
  component: File,
} as Meta

const Template: Story<Parameters<typeof File>[0]> = (args) => <File {...args} />

export const Default = Template.bind({})
Default.args = {
  client: new Client({ session: '0ZboLklNFmEyRnUSnMgtMg' }),
  path: 'table.csv',
}
