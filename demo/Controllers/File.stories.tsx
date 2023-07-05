import { Meta, StoryObj } from '@storybook/react'
import { Client } from '../../src/client'
import FileController from '../../src/client/components/Controllers/File'

type Story = StoryObj<typeof FileController>
const meta: Meta<typeof FileController> = {
  component: FileController,
}

export default meta

// Data

const path = 'image.jpg'
const client = new Client()

// Stories

export const Default: Story = {
  args: {
    path,
    client,
  },
}
