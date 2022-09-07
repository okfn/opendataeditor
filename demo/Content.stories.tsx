import React from 'react'
import { Story, Meta } from '@storybook/react'
import Content from '../src/components/Content'

export default {
  title: 'Components/Content',
  component: Content,
} as Meta

const Template: Story<Parameters<typeof Content>[0]> = (args) => <Content {...args} />

export const Default = Template.bind({})
Default.args = {
  session: '0ZboLklNFmEyRnUSnMgtMg',
  path: 'table.csv',
}
