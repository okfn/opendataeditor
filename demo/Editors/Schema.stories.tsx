import { Meta, StoryObj } from '@storybook/react'
import SchemaEditort from '../../src/client/components/Editors/Schema'
import * as types from '../../src/client/types'

type Story = StoryObj<typeof SchemaEditort>
const meta: Meta<typeof SchemaEditort> = {
  component: SchemaEditort,
}

export default meta

// Data

const schema: types.ISchema = {
  fields: [
    { name: 'id', type: 'integer', format: 'default' },
    { name: 'name', type: 'string', format: 'default' },
  ],
  missingValues: [''],
}

// Stories

// Stories

export const Default: Story = {
  args: {
    schema,
    onChange: console.log,
    onFieldSelected: console.log,
  },
}
