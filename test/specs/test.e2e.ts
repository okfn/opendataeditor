import { $, expect } from '@wdio/globals'
import path from 'node:path'

describe('ODE basic workflow', () => {
    it('displays welcoming screen and FocusTrap exist until user clicks Get Started', async () => {
        // ODE has a Loading window and a main Window. We need to switch to the main one.
        const handles = await browser.getWindowHandles()
        await browser.switchToWindow(handles[0])

        // Calling browser.react$(...) will fail to find the root element. So we find it explicitly.
        // https://github.com/baruchvlz/resq/issues/31#issuecomment-493760156
        const root = await $('#root')
        const banner = await root.react$('WelcomeBanner')
        await expect(banner).toHaveText(expect.stringContaining('Welcome to the Open Data Editor!'))

        const simpleButton = await root.react$('SimpleButton', {props: {label: 'Get started'}})
        const focusTrap = await root.react$('FocusTrap')
        const uploadYourDataButton = await $('.sidebar .MuiButton-outlined')

        await expect(focusTrap).toExist()
        await expect(uploadYourDataButton).not.toBeClickable()
        simpleButton.click()
        await expect(focusTrap).not.toExist()
        await expect(uploadYourDataButton).toBeClickable()

    }),
    it('uploads a csv file, file navigator adds an node, and the file content gets display', async() => {
      const filePath = path.join(__dirname, '../data/valid.csv')
      const remoteFilePath = await browser.uploadFile(filePath)
      const root = await $('#root')

      await root.$('.sidebar .MuiButton-outlined').click()
      await root.$('button#simple-tab-1').click()
      // Adding the file to the hidden input[type=file] will trigger a server upload
      await $('input.MuiOutlinedInput-input').addValue(remoteFilePath)

      const fileTreeNode = await root.react$('TreeNode', {props: {label: 'valid.csv'}})
      await expect(fileTreeNode).toExist()
      const tableEditor = await root.react$('TableEditor')
      await expect(tableEditor).toExist()
      // Calling tableEditor.toHaveText() fails (library bug?), get the element without using react$ selector
      const dataGrid = await $('.InovuaReactDataGrid')
      await expect(dataGrid).toHaveText(expect.stringContaining('Renault'))

      // We need to close the window for the FastAPI server to be closed and the port freed.
      browser.closeWindow()
    })
})

