import { $, expect } from '@wdio/globals'

describe('Electron Testing', () => {
    it('displays welcomming screen', async () => {
        // ODE has a Loading window and a main Window. We need to switch to the main one.
        const handles = await browser.getWindowHandles()
        await browser.switchToWindow(handles[0])

        // Calling browser.react$(...) will fail to find the root element. So we find it explicitly.
        // https://github.com/baruchvlz/resq/issues/31#issuecomment-493760156
        const root = await $('#root')
        const banner = await root.react$('WelcomeBanner')
        await expect(banner).toHaveText(expect.stringContaining('Welcome to the Open Data Editor!'))
        const simpleButton = await root.react$('SimpleButton', {props: {label: 'Get started'}})
        await simpleButton.click()

        browser.closeWindow()
    })
})

