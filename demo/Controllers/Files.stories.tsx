import React from 'react'
import { Story, Meta } from '@storybook/react'
import { Client } from '../../src/client'
import Files from '../../src/components/Controllers/Files'

export default {
  title: 'Controllers/Files',
  component: Files,
} as Meta

const Template: Story<Parameters<typeof Files>[0]> = (args) => <Files {...args} />

export const Default = Template.bind({})
Default.args = {
  client: new Client({ session: '0ZboLklNFmEyRnUSnMgtMg' }),
  onPathChange: (path?: string) => console.log(path),
}
export const Empty = Template.bind({})
Empty.args = {
  client: new Client({ session: '1-zsQ3tQ-zKTGFYhKY235g' }),
  onPathChange: (path?: string) => console.log(path),
}
