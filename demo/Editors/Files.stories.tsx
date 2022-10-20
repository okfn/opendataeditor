import React from 'react'
import { Story, Meta } from '@storybook/react'
import { Client } from '../../src/client'
import Files from '../../src/components/Editors/Files'

export default {
  title: 'Editors/Files',
  component: Files,
} as Meta

const Template: Story<Parameters<typeof Files>[0]> = (args) => <Files {...args} />

export const Default = Template.bind({})
Default.args = {
  client: new Client({ session: '0ZboLklNFmEyRnUSnMgtMg' }),
  onPathChange: (path?: string) => console.log(path),
}
