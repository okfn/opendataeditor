import { Meta, StoryObj } from '@storybook/react'
import { Client } from '../../src/client'
import MetadataController from '../../src/client/components/Controllers/Metadata'

type Story = StoryObj<typeof MetadataController>
const meta: Meta<typeof MetadataController> = {
  component: MetadataController,
}

export default meta

// Data

const path = 'schema.json'
const client = new Client()

// Stories

export const Default: Story = {
  args: {
    path,
    client,
  },
}
