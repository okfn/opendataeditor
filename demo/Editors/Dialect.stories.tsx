import { Meta, StoryObj } from '@storybook/react'
import DialectEditort from '../../src/client/components/Editors/Dialect'
import * as types from '../../src/client/types'

type Story = StoryObj<typeof DialectEditort>
const meta: Meta<typeof DialectEditort> = {
  component: DialectEditort,
}

export default meta

// Data

const format = 'csv'
const dialect: types.IDialect = {
  headerRows: [1, 2],
  csv: { delimiter: ';' },
}

// Stories

export const Default: Story = {
  args: {
    format,
    dialect,
    onChange: console.log,
  },
}
