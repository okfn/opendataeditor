import React from 'react'
import { Story, Meta } from '@storybook/react'
import Metadata from '../../src/components/Applications/Metadata'

export default {
  title: 'Editors/Metadata',
  component: Metadata,
} as Meta

const Template: Story<Parameters<typeof Metadata>[0]> = (args) => <Metadata {...args} />

// Stories

export const Default = Template.bind({})
Default.args = {}
