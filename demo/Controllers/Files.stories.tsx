import React from 'react'
import { Story, Meta } from '@storybook/react'
import { Client } from '../../src/client'
import Files from '../../src/components/Controllers/Files'

export default {
  title: 'Controllers/Files',
  component: Files,
} as Meta

const Template: Story<Parameters<typeof Files>[0]> = (args) => <Files {...args} />

// Props

const client = new Client()
const onPathChange = (path?: string) => console.log(path)

// Stories

export const Default = Template.bind({})
Default.args = {
  client,
  onPathChange,
}
