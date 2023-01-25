import React from 'react'
import { Story, Meta } from '@storybook/react'
import Source from '../../src/components/Editors/Source'

export default {
  title: 'Editors/Source',
  component: Source,
} as Meta

const Template: Story<Parameters<typeof Source>[0]> = (args) => <Source {...args} />

export const Default = Template.bind({})
Default.args = {
  source: '1,english\n2,中国人\n',
}
