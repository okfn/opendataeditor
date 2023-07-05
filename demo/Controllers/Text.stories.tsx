import { Meta, StoryObj } from '@storybook/react'
import { Client } from '../../src/client'
import TextController from '../../src/client/components/Controllers/Text'

type Story = StoryObj<typeof TextController>
const meta: Meta<typeof TextController> = {
  component: TextController,
}

export default meta

// Data

const path = 'article.md'
const client = new Client()

// Stories

export const Default: Story = {
  args: {
    path,
    client,
  },
}
