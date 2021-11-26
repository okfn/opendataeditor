import React from 'react'
import { Story, Meta } from '@storybook/react'
import Query from '../src/components/Query'

export default {
  title: 'Components/Query',
  component: Query,
} as Meta

const Template: Story<Parameters<typeof Query>[0]> = (args) => <Query {...args} />

export const Default = Template.bind({})
Default.args = {}
