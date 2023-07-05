import { Meta, StoryObj } from '@storybook/react'
import DialectEditor from '../../src/client/components/Editors/Dialect'
import * as types from '../../src/client/types'

type Story = StoryObj<typeof DialectEditor>
const meta: Meta<typeof DialectEditor> = {
  component: DialectEditor,
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
