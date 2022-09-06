import React from 'react'
import { Story, Meta } from '@storybook/react'
import Project from '../src/components/Project'

export default {
  title: 'Components/Project',
  component: Project,
} as Meta

const Template: Story<Parameters<typeof Project>[0]> = (args) => <Project {...args} />

export const Default = Template.bind({})
Default.args = {
  session: '0ZboLklNFmEyRnUSnMgtMg',
  onPathChange: (path?: string) => console.log(path),
}
