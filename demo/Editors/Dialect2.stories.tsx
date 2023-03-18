import React from 'react'
import { Story, Meta } from '@storybook/react'
import Dialect from '../../src/components/Editors/Dialect2'

export default {
  title: 'Editors/Dialect2',
  component: Dialect,
} as Meta

const Template: Story<Parameters<typeof Dialect>[0]> = (args) => <Dialect {...args} />

// Props

const format = 'csv'
const dialect = {
  headerRows: [1, 2],
  csv: { delimiter: ';' },
}

// Stories

export const Default = Template.bind({})
Default.args = {
  format,
  dialect,
  onChange: console.log,
}